import { Component, Output, EventEmitter } from '@angular/core';

import { BlockSelect, BlockType } from '@/core/types';

@Component({
  selector: 'add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.scss'],
})
export class AddBlockComponent {
  blockSelectList: BlockSelect[] = [
    { label: 'Say', type: BlockType.Say },
    { label: 'Wait Date', type: BlockType.WaitDate },
    { label: 'Wait Text', type: BlockType.WaitText },
    { label: 'Switch', type: BlockType.Switch },
  ];
  blockTypeSelected: BlockType = BlockType.Say;
  @Output() add = new EventEmitter<BlockType>();

  addBlock(): void {
    this.add.emit(this.blockTypeSelected);
  }
}
