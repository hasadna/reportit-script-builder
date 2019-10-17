import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SayBlock } from '@/core/types';

@Component({
  selector: 'say-block',
  templateUrl: './say-block.component.html',
  styleUrls: ['./say-block.component.scss'],
})
export class SayBlockComponent {
  @Input() block: SayBlock;
  @Output() remove = new EventEmitter<void>();
}
