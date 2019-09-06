import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { randstr64, randCustomString, numerals } from 'rndmjs';

import { BlockData, BlockSelect, BlockType } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'page-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnDestroy {
  blockList: BlockData[] = [];
  blockSelectList: BlockSelect[] = [
    { label: 'Text', type: BlockType.Text },
    { label: 'Date', type: BlockType.Date },
    { label: 'Input', type: BlockType.Input },
  ];
  blockTypeSelected: BlockType = BlockType.Text;
  refreshSub = new Subscription();

  constructor(private blockService: BlockService) {
    this.updateBlockList();
    this.refreshSub = this.blockService.refreshChanges.subscribe(() => {
      this.updateBlockList();
    });
  }

  updateBlockList(): void {
    this.blockList = Object.values(this.blockService.blockMap);
  }

  addBlock(): void {
    const newBlock = new BlockData(randstr64(10), this.blockTypeSelected);
    newBlock.name = 'Block #' + randCustomString(numerals, 4);
    this.blockService.blockMap[newBlock.id] = newBlock;
    this.updateBlockList();
  }

  ngOnDestroy() {
    this.refreshSub.unsubscribe();
  }
}
