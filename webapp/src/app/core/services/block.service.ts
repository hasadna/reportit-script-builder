import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { BlockData, BlockDataMap } from '@/core/types';

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
}
