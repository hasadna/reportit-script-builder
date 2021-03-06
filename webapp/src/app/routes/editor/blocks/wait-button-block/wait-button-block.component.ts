import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { WaitButtonBlock, WaitButton, OrderArrow, SwitchBlock } from '@/core/types';
import { BlockService, NotificationService } from '@/core/services';

@Component({
  selector: 'wait-button-block',
  templateUrl: './wait-button-block.component.html',
  styleUrls: ['./wait-button-block.component.scss'],
})
export class WaitButtonBlockComponent implements OnInit, OnDestroy {
  input = new FormControl();
  switchBlockList: SwitchBlock[] = [];
  switchSub = new Subscription();
  @Input() block: WaitButtonBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  constructor(
    private blockService: BlockService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.input.setValue(this.block.variable, { emitEvent: false });
    this.blockService.variableBlockMap[this.block.id] = this.block;
    this.blockService.variableChanges.next();
    this.initSubs();
  }

  initSubs(): void {
    this.createSwitchLink();
    this.switchSub = this.blockService.switchChanges
      .pipe(debounceTime(0)) // ExpressionChangedAfterItHasBeenCheckedError fix
      .subscribe(() => {
        this.createSwitchLink();
      });
    this.input.valueChanges
      .pipe(debounceTime(100))
      .subscribe(value => {
        // When user is changing input
        this.block.variable = value;
        for (const switchBlock of this.switchBlockList) {
          // Update all switch blocks too
          switchBlock.arg = value;
        }
        for (const switchBlock of Object.values(this.blockService.switchBlockMap)) {
          switchBlock.update();
        }
        // In case new variable equals to one of switch args (updates all wait/do blocks)
        this.blockService.switchChanges.next();
      });
  }

  createSwitchLink(): void {
    // Get all child switch blocks, to be able to scroll to them
    this.switchBlockList = [];
    for (const switchBlock of Object.values(this.blockService.switchBlockMap)) {
      if (switchBlock.arg === this.block.variable) {
        this.switchBlockList.push(switchBlock);
      }
    }
  }

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }

  upButton(index: number): void {
    this.blockService.reorder(OrderArrow.Up, index, this.block.buttons);
  }

  downButton(index: number): void {
    this.blockService.reorder(OrderArrow.Down, index, this.block.buttons);
  }

  addButton(): void {
    const button: WaitButton = {
      show: '',
      value: '',
    };
    this.block.buttons.unshift(button);
  }

  deleteButton(index: number): void {
    this.block.buttons.splice(index, 1);
  }

  scroll(switchBlock: SwitchBlock): void {
    switchBlock.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  removeSelf(): void {
    if (this.switchBlockList.length > 0) {
      this.notificationService.warning('Please change all switch, which point to the wait');
    } else {
      this.remove.emit();
    }
  }

  ngOnDestroy() {
    this.switchSub.unsubscribe();
  }
}
