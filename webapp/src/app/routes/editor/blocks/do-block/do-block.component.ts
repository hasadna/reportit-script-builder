import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DoBlock } from '@/core/types';

@Component({
  selector: 'do-block',
  templateUrl: './do-block.component.html',
  styleUrls: ['./do-block.component.scss'],
})
export class DoBlockComponent {
  @Input() block: DoBlock;
  @Output() remove = new EventEmitter<void>();
}
