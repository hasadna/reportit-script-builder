import { Component } from '@angular/core';

import { BlockDataMap, BlockData, BlockDataJSON } from '@/core/types';
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
      const blockList: BlockDataJSON[] = JSON.parse(this.json);
      for (const block of blockList) {
        blockMap[block.id] = BlockData.fromObject(block);
      }
      this.blockService.blockMap = blockMap;
      this.notificationService.success('Saved');
    } catch (e) {
      this.notificationService.error('Parsing error');
    }
  }

  // Converts service data to JSON
  toJSON(): void {
    this.json = JSON.stringify(this.blockService.getBlockList());
  }
}
