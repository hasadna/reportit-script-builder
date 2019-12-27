import { Component, Input, Output, EventEmitter } from '@angular/core';

import { GotoBlock, OrderArrow } from '@/core/types';

@Component({
  selector: 'goto-block',
  templateUrl: './goto-block.component.html',
  styleUrls: ['./goto-block.component.scss'],
})
export class GotoBlockComponent {
  @Input() block: GotoBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }
}
