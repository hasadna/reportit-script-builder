import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DoBlock, OrderArrow } from '@/core/types';

@Component({
  selector: 'do-block',
  templateUrl: './do-block.component.html',
  styleUrls: ['./do-block.component.scss'],
})
export class DoBlockComponent {
  @Input() block: DoBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }
}
