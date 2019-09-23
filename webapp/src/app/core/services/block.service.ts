import { Injectable } from '@angular/core';

import { BlockType, Block, SayBlock, WaitInputBlock, SwitchBlock } from '@/core/types';

@Injectable()
export class BlockService {
  blockList: Block[] = [];

  getNewBlock(blockType: BlockType): SayBlock | WaitInputBlock | SwitchBlock {
    switch (blockType) {
      case BlockType.Say: return new SayBlock(blockType);
      case BlockType.WaitDate:
      case BlockType.WaitText: return new WaitInputBlock(blockType);
      case BlockType.Switch: return new SwitchBlock(blockType);

      default: throw new Error('Block type not found');
    }
  }

  fromObject(block: Block): Block {
    const newBlock: Block = this.getNewBlock(block.type);
    return Object.assign(newBlock, block);
  }
}
