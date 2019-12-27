import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SayBlock, OrderArrow } from '@/core/types';

@Component({
  selector: 'say-block',
  templateUrl: './say-block.component.html',
  styleUrls: ['./say-block.component.scss'],
})
export class SayBlockComponent {
  @Input() block: SayBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }
}
