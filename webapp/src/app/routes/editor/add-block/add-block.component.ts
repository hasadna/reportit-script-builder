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
    { label: 'Wait Button', type: BlockType.WaitButton },
    { label: 'Wait Step Button', type: BlockType.WaitButtonStep },
    { label: 'Switch', type: BlockType.Switch },
    { label: 'Go To', type: BlockType.Goto },
    { label: 'Do', type: BlockType.Do },
  ];
  blockTypeSelected: BlockType = BlockType.Say;
  @Output() add = new EventEmitter<BlockType>();

  addBlock(): void {
    this.add.emit(this.blockTypeSelected);
  }
}
