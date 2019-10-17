import { Component, Input, Output, EventEmitter } from '@angular/core';

import { GotoBlock } from '@/core/types';

@Component({
  selector: 'goto-block',
  templateUrl: './goto-block.component.html',
  styleUrls: ['./goto-block.component.scss'],
})
export class GotoBlockComponent {
  @Input() block: GotoBlock;
  @Output() remove = new EventEmitter<void>();
}
