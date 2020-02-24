import { Component } from '@angular/core';

import { BlockType, SnippetBlock, OrderArrow } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'snippets',
  templateUrl: './snippets.component.html',
  styleUrls: ['./snippets.component.scss'],
})
export class SnippetsComponent {
  constructor(public blockService: BlockService) { }

  removeSnippet(index: number): void {
    this.blockService.blockList.splice(index, 1);
  }

  addSnippet(): void {
    const snippetBlock = new SnippetBlock(BlockType.Snippet, null);
    this.blockService.blockList.push(snippetBlock);
  }

  reorderBlock(direction: OrderArrow, index: number): void {
    this.blockService.reorder(direction, index, this.blockService.blockList);
  }
}
