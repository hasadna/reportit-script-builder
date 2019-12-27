import { Component, Input } from '@angular/core';

import { Block, BlockType, OrderArrow } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.scss'],
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

  reorderBlock(direction: OrderArrow, index: number): void {
    this.blockService.reorder(direction, index, this.blockList);
  }
}
