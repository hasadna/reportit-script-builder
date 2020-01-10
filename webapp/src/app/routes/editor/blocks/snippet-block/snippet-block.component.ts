import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SnippetBlock, OrderArrow, GotoBlock } from '@/core/types';
import { BlockService, NotificationService } from '@/core/services';

@Component({
  selector: 'snippet-block',
  templateUrl: './snippet-block.component.html',
  styleUrls: ['./snippet-block.component.scss'],
})
export class SnippetBlockComponent implements OnInit, OnDestroy {
  input = new FormControl();
  gotoBlockList: GotoBlock[] = [];
  gotoSub = new Subscription();
  @Input() block: SnippetBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  constructor(
    private blockService: BlockService,
    private notificationService: NotificationService,
  ) {
    this.gotoSub = this.blockService.gotoChanges
      .pipe(debounceTime(0)) // ExpressionChangedAfterItHasBeenCheckedError fix
      .subscribe(() => {
        // Get all child goto block, to be able to scroll to them
        this.gotoBlockList = [];
        for (const gotoBlock of Object.values(this.blockService.gotoBlockMap)) {
          if (gotoBlock.goto === this.block.name) {
            this.gotoBlockList.push(gotoBlock);
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
      for (const gotoBlock of this.gotoBlockList) {
        // Tell child goto blocks, that the snippet is deleted
        gotoBlock.update();
      }
    }
  }

  ngOnDestroy() {
    this.gotoSub.unsubscribe();
  }
}
