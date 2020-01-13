import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SwitchBlock, OrderArrow } from '@/core/types';
import { BlockService, YamlService } from '@/core/services';

@Component({
  selector: 'switch-block',
  templateUrl: './switch-block.component.html',
  styleUrls: ['./switch-block.component.scss'],
})
export class SwitchBlockComponent implements OnInit, AfterViewInit, OnDestroy {
  isNotFound: boolean;
  variableList: string[] = [];
  varSub = new Subscription();
  @ViewChild('anchor', { static: false }) blockRef: ElementRef;
  @Input() block: SwitchBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  constructor(
    private blockService: BlockService,
    private yamlService: YamlService,
  ) { }

  ngOnInit() {
    this.block.update = () => this.updateVarList();
    this.block.destroy = () => this.removeSelf();
    this.blockService.switchBlockMap[this.block.id] = this.block;
    this.varSub = this.blockService.variableChanges
      .pipe(debounceTime(0)) // ExpressionChangedAfterItHasBeenCheckedError fix
      .subscribe(() => {
        this.updateVarList();
      });
  }

  ngAfterViewInit() {
    this.block.element = this.blockRef.nativeElement;
    this.blockService.switchChanges.next(this.block);
  }

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }

  upCase(index: number): void {
    this.blockService.reorder(OrderArrow.Up, index, this.block.cases);
  }

  downCase(index: number): void {
    this.blockService.reorder(OrderArrow.Down, index, this.block.cases);
  }

  addCase(): void {
    this.block.cases.unshift({
      match: '',
      isDefault: false,
      steps: [],
    });
  }

  // Creates list with all available variables and finds out "is current arg in the list?"
  updateVarList(): void {
    this.isNotFound = true;
    this.variableList = [];
    const globalVariableList: string[] = this.yamlService.constants.slice();
    globalVariableList.push(
      ...Object.values(this.blockService.variableBlockMap).map(block => block.variable),
    );
    for (const variable of globalVariableList) {
      if (
        !this.variableList.includes(variable) &&
        variable.length > 0
      ) {
        // Create variable list (no duplicates, no empty variables)
        this.variableList.push(variable);
      }
      if (variable === this.block.arg) {
        this.isNotFound = false;
      }
    }
  }

  select(variable: string): void {
    this.block.arg = variable;
    this.blockService.switchChanges.next(this.block);
  }

  removeSelf(): void {
    for (const switchCase of this.block.cases) {
      this.blockService.destroyChilds(switchCase);
    }
    this.remove.emit();
    delete this.blockService.switchBlockMap[this.block.id];
    this.blockService.switchChanges.next();
  }

  deleteCase(index: number): void {
    this.blockService.destroyChilds(this.block.cases[index]);
    this.block.cases.splice(index, 1);
  }

  ngOnDestroy() {
    this.varSub.unsubscribe();
  }
}
