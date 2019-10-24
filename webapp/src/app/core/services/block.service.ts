import { Injectable } from '@angular/core';

import {
  BlockType,
  Block,
  SayBlock,
  WaitInputBlock,
  WaitButtonBlock,
  WaitButtonStepBlock,
  SwitchBlock,
  SnippetBlock,
  GotoBlock,
  DoBlock,
} from '@/core/types';

@Injectable()
export class BlockService {
  blockList: Block[] = [];

  getNewBlock(blockType: BlockType):
    SayBlock |
    WaitInputBlock |
    SwitchBlock |
    SnippetBlock |
    GotoBlock |
    WaitButtonBlock |
    WaitButtonStepBlock |
    DoBlock {
    switch (blockType) {
      case BlockType.Say: return new SayBlock(blockType);
      case BlockType.WaitDate:
      case BlockType.WaitText: return new WaitInputBlock(blockType);
      case BlockType.Switch: return new SwitchBlock(blockType);
      case BlockType.Snippet: return new SnippetBlock(blockType);
      case BlockType.Goto: return new GotoBlock(blockType);
      case BlockType.WaitButton: return new WaitButtonBlock(blockType);
      case BlockType.WaitButtonStep: return new WaitButtonStepBlock(blockType);
      case BlockType.WaitButtonStep: return new WaitButtonStepBlock(blockType);
      case BlockType.Do: return new DoBlock(blockType);

      default: throw new Error('Block type not found');
    }
  }

  fromObject(block: Block): Block {
    const newBlock: Block = this.getNewBlock(block.type);
    return Object.assign(newBlock, block);
  }
}
