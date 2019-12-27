import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SwitchBlock, OrderArrow } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'switch-block',
  templateUrl: './switch-block.component.html',
  styleUrls: ['./switch-block.component.scss'],
})
export class SwitchBlockComponent {
  @Input() block: SwitchBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  constructor(private blockService: BlockService) { }

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

  deleteCase(index: number): void {
    this.block.cases.splice(index, 1);
  }
}
