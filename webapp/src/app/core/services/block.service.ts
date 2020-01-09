import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
  InfocardBlock,
  TaskTemplateBlock,
  OrganizationBlock,
  OrderArrow,
} from '@/core/types';

@Injectable()
export class BlockService {
  description: string = '';
  name: string = '';
  blockList: Block[] = [];
  gotoBlockMap: { [id: string]: GotoBlock } = {};
  gotoChanges = new Subject<void>();

  getNewBlock(blockType: BlockType):
    SayBlock |
    WaitInputBlock |
    SwitchBlock |
    SnippetBlock |
    GotoBlock |
    WaitButtonBlock |
    WaitButtonStepBlock |
    DoBlock |
    InfocardBlock |
    OrganizationBlock |
    TaskTemplateBlock {
    switch (blockType) {
      case BlockType.Say: return new SayBlock(blockType);
      case BlockType.WaitDate:
      case BlockType.WaitText: return new WaitInputBlock(blockType);
      case BlockType.Switch: return new SwitchBlock(blockType);
      case BlockType.Snippet: return new SnippetBlock(blockType);
      case BlockType.Goto: return new GotoBlock(blockType);
      case BlockType.WaitButton: return new WaitButtonBlock(blockType);
      case BlockType.WaitButtonStep: return new WaitButtonStepBlock(blockType);
      case BlockType.Do: return new DoBlock(blockType);
      case BlockType.Infocard: return new InfocardBlock(blockType);
      case BlockType.TaskTemplate: return new TaskTemplateBlock(blockType);
      case BlockType.Organization: return new OrganizationBlock(blockType);

      default: throw new Error('Block type not found');
    }
  }

  fromObject(block: Block): Block {
    const newBlock: Block = this.getNewBlock(block.type);
    return Object.assign(newBlock, block);
  }

  reorder(direction: OrderArrow, index: number, array: any[]): void {
    const offset: number = direction * 2 - 1; // [0, 1] -> [-1, 1]
    const newIndex: number = index + offset;
    if (newIndex >= 0 && newIndex < array.length) {
      const stash: any = array[newIndex];
      array[newIndex] = array[index];
      array[index] = stash;
    }
  }
}
