import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SnippetBlock } from '@/core/types';

@Component({
  selector: 'snippet-block',
  templateUrl: './snippet-block.component.html',
  styleUrls: ['./snippet-block.component.scss'],
})
export class SnippetBlockComponent {
  @Input() block: SnippetBlock;
  @Output() remove = new EventEmitter<void>();
}
