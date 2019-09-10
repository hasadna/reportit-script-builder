import { Component } from '@angular/core';

import { BlockDataMap, BlockData } from '@/core/types';
import { BlockService, NotificationService } from '@/core/services';

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
    const blockMap: BlockDataMap = {};
    try {
      const blockList: BlockData[] = JSON.parse(this.json);
      for (const block of blockList) {
        const newBlock = new BlockData(block.id, block.type);
        newBlock.text = block.text;
        newBlock.date = block.date;
        newBlock.variableId = block.variableId;
        // TODO: can we assign? If not, make this a method of BlockData.
        blockMap[block.id] = newBlock;
      }
      this.blockService.blockMap = blockMap;
      this.notificationService.success('Saved');
    } catch (e) {
      this.notificationService.error('Parsing error');
    }
  }

  // Converts service data to JSON
  toJSON(): void {
    // TODO: Add order here too when adding BlockData.order
    this.json = JSON.stringify(Object.values(this.blockService.blockMap));
  }
}
