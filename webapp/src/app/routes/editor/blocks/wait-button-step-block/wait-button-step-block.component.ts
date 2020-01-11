import { Component, Input, Output, EventEmitter } from '@angular/core';

import { WaitButtonStepBlock, OrderArrow } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'wait-button-step-block',
  templateUrl: './wait-button-step-block.component.html',
  styleUrls: ['./wait-button-step-block.component.scss'],
})
export class WaitButtonStepBlockComponent {
  @Input() block: WaitButtonStepBlock;
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
    this.block.buttons.unshift({
      show: '',
      steps: [],
    });
  }

  removeSelf(): void {
    for (const button of this.block.buttons) {
      this.blockService.destroyChilds(button);
    }
    this.remove.emit();
  }

  deleteButton(index: number): void {
    this.block.buttons.splice(index, 1);
    this.blockService.destroyChilds(this.block.buttons[index]);
  }
}
