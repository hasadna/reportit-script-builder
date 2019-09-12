import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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
    this.blockList = this.blockService.getBlockList();
  }

  addBlock(): void {
    this.blockService.addBlock(this.blockTypeSelected);
    this.updateBlockList();
  }

  ngOnDestroy() {
    this.refreshSub.unsubscribe();
  }
}
