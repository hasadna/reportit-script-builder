import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SnippetBlock, OrderArrow, GotoBlock, Block, WithParent } from '@/core/types';
import { BlockService, NotificationService } from '@/core/services';

@Component({
  selector: 'snippet-block',
  templateUrl: './snippet-block.component.html',
  styleUrls: ['./snippet-block.component.scss'],
})
export class SnippetBlockComponent implements OnInit, OnDestroy, AfterViewInit {
  input = new FormControl();
  gotoBlockList: GotoBlock[] = [];
  sourceSnippets: string[] = [];
  gotoSub = new Subscription();
  @Input() block: SnippetBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();
  @ViewChild('anchor', { static: false }) blockRef: ElementRef;

  constructor(
    private blockService: BlockService,
    private notificationService: NotificationService,
  ) {
    this.gotoSub = this.blockService.gotoChanges
      .pipe(debounceTime(0)) // ExpressionChangedAfterItHasBeenCheckedError fix
      .subscribe(() => {
        // Get all child goto blocks, to be able to scroll to them
        this.gotoBlockList = [];
        this.sourceSnippets = [];
        for (const gotoBlock of Object.values(this.blockService.gotoBlockMap)) {
          if (gotoBlock.goto === this.block.name) {
            this.gotoBlockList.push(gotoBlock);
            let parentBlock: WithParent = gotoBlock;
            const sourceNames = [];
            while (parentBlock) {
              parentBlock = parentBlock.parent;
              if (!parentBlock) {
                break;
              }
              if (parentBlock['name']) {
                sourceNames.unshift(parentBlock['name']);
                break;
              }
              if (parentBlock['show']) {
                sourceNames.unshift(parentBlock['show']);
              }
              if (parentBlock['match']) {
                sourceNames.unshift(parentBlock['match']);
              }
            }
            this.sourceSnippets.push(sourceNames.join(' / '));
          }
        }
      });
    this.input.valueChanges.subscribe(value => {
      // When user is changing input
      this.block.name = value;
      for (const gotoBlock of this.gotoBlockList) {
        // Update all goto blocks too
        gotoBlock.goto = value;
      }
    });
  }

  ngOnInit() {
    this.input.setValue(this.block.name, { emitEvent: false });
  }

  ngAfterViewInit() {
    this.block.element = this.blockRef.nativeElement;
  }

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }

  scroll(gotoBlock: GotoBlock): void {
    gotoBlock.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  removeSelf(): void {
    if (this.gotoBlockList.length > 0) {
      this.notificationService.warning('Please change all goto, which point to the snippet');
    } else {
      this.remove.emit();
    }
  }

  ngOnDestroy() {
    this.gotoSub.unsubscribe();
  }
}
