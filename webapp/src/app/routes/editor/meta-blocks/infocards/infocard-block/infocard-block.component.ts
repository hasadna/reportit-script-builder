import { Component, Input, Output, EventEmitter } from '@angular/core';

import { InfocardBlock, OrderArrow } from '@/core/types';

@Component({
  selector: 'infocard-block',
  templateUrl: './infocard-block.component.html',
  styleUrls: ['./infocard-block.component.scss'],
})
export class InfocardBlockComponent {
  @Input() block: InfocardBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }
}
