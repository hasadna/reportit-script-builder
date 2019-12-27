import { Component, Input, Output, EventEmitter } from '@angular/core';

import { WaitButtonBlock, WaitButton, OrderArrow } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'wait-button-block',
  templateUrl: './wait-button-block.component.html',
  styleUrls: ['./wait-button-block.component.scss'],
})
export class WaitButtonBlockComponent {
  @Input() block: WaitButtonBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  constructor(private blockService: BlockService) { }

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
}
