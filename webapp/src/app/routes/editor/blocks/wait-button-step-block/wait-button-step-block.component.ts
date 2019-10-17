import { Component, Input, Output, EventEmitter } from '@angular/core';

import { WaitButtonStepBlock } from '@/core/types';

@Component({
  selector: 'wait-button-step-block',
  templateUrl: './wait-button-step-block.component.html',
  styleUrls: ['./wait-button-step-block.component.scss'],
})
export class WaitButtonStepBlockComponent {
  @Input() block: WaitButtonStepBlock;
  @Output() remove = new EventEmitter<void>();

  addButton(): void {
    this.block.buttons.push({
      show: '',
      steps: [],
    });
  }

  deleteButton(index: number): void {
    this.block.buttons.splice(index, 1);
  }
}
