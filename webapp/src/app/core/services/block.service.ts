import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { randstr64, randCustomString, numerals } from 'rndmjs';

import { BlockData, BlockDataMap, BlockType } from '@/core/types';

@Injectable()
export class BlockService {
  blockMap: BlockDataMap = {};
  refreshChanges = new Subject<void>();

  updateBlock(block: BlockData): void {
    this.blockMap[block.id] = block;
  }

  deleteBlock(block: BlockData): void {
    delete this.blockMap[block.id];
    this.refreshChanges.next();
  }

  addBlock(blockType: BlockType): void {
    const newBlock = new BlockData(randstr64(10), blockType);
    newBlock.order = Object.values(this.blockMap).length;
    newBlock.variableId = randCustomString(numerals, 4);
    this.blockMap[newBlock.id] = newBlock;
  }

  getBlockList(): BlockData[] {
    const blockList: BlockData[] = Object.values(this.blockMap);
    blockList.sort((a, b) => Math.sign(a.order - b.order)); // Oldest first
    // [0,1,3,4,5] -> [0,1,2,3,4]
    // In case some block were deleted.
    blockList.forEach((block, i) => block.order = i);
    return blockList;
  }
}
