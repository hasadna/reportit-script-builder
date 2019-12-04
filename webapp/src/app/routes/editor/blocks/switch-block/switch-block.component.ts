import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SwitchBlock } from '@/core/types';

@Component({
  selector: 'switch-block',
  templateUrl: './switch-block.component.html',
  styleUrls: ['./switch-block.component.scss'],
})
export class SwitchBlockComponent {
  @Input() block: SwitchBlock;
  @Output() remove = new EventEmitter<void>();

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
