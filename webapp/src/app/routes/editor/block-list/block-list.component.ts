import { Component, Input } from '@angular/core';

import { Block, BlockType } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'block-list',
  templateUrl: './block-list.component.html',
})
export class BlockListComponent {
  @Input() blockList: Block[];

  constructor(private blockService: BlockService) { }

  removeBlock(index: number): void {
    this.blockList.splice(index, 1);
  }

  addBlock(blockType: BlockType): void {
    const newBlock: Block = this.blockService.getNewBlock(blockType);
    this.blockList.push(newBlock);
  }
}
