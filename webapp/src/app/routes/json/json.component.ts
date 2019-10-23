import { Component } from '@angular/core';

import { Block, SwitchBlock, WaitButtonStepBlock, SnippetBlock } from '@/core/types';
import { BlockService, NotificationService } from '@/core/services';
import {YAML} from 'json-to-pretty-yaml/index';

@Component({
  selector: 'page-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.scss'],
})
export class JsonComponent {
  json: string;

  constructor(
    private blockService: BlockService,
    private notificationService: NotificationService,
  ) {
    this.toJSON();
  }

  // Converts JSON string to service data
  fromJSON(): void {
    try {
      this.blockService.blockList = this.getBlockList(JSON.parse(this.json));
      this.notificationService.success('Saved');
    } catch (e) {
      this.notificationService.error('Parsing error');
    }
  }

  getBlockList(blockListJSON: Block[]): Block[] {
    const blockList: Block[] = [];
    for (const block of blockListJSON) {
      // Blocks from JSON.parse don't have any method.
      // So we need to recreate them
      const newBlock: Block = this.blockService.fromObject(block);
      if (newBlock.isSwitchBlock()) {
        // Recreate switch sub blocks
        for (const blockCase of (newBlock as SwitchBlock).cases) {
          blockCase.steps = this.getBlockList(blockCase.steps);
        }
      } else if (newBlock.isWaitButtonStepBlock()) {
        // Recreate buttons sub blocks
        for (const blockButton of (newBlock as WaitButtonStepBlock).buttons) {
          blockButton.steps = this.getBlockList(blockButton.steps);
        }
      } else if (newBlock.isSnippetBlock()) {
        // Recreate snippet sub blocks
        const snippetBlock = newBlock as SnippetBlock;
        snippetBlock.steps = this.getBlockList(snippetBlock.steps);
      }
      blockList.push(newBlock);
    }
    return blockList;
  }

  // Converts service data to JSON
  toJSON(): void {
    // y dis not work?
    this.json = YAML.stringify(this.blockService.blockList, null, 2);
  }
}
