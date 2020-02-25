import { Component, Output, EventEmitter } from '@angular/core';

import { BlockSelect, BlockType } from '@/core/types';

@Component({
  selector: 'add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.scss'],
})
export class AddBlockComponent {
  blockSelectList: BlockSelect[] = [
    { label: 'הצגת הודעה למשתמש/ת (Say)', type: BlockType.Say },
    { label: 'שאלת תאריך (Wait Date)', type: BlockType.WaitDate },
    { label: 'שאלה טקסטואלית פתוחה (Wait Text)', type: BlockType.WaitText },
    { label: 'שאלה סגורה (Wait Button)', type: BlockType.WaitButton },
    { label: 'שאלה סגורה+תגובות מותאמות (Wait Step Button', type: BlockType.WaitButtonStep },
    { label: 'פיצול התסריט (Switch)', type: BlockType.Switch },
    { label: 'מעבר למקטע אחר בתסריט (Goto)', type: BlockType.Goto },
    { label: 'ביצוע פקודה (Do)', type: BlockType.Do },
  ];
  blockTypeSelected: BlockType = BlockType.Say;
  @Output() add = new EventEmitter<BlockType>();

  addBlock(): void {
    this.add.emit(this.blockTypeSelected);
  }
}
