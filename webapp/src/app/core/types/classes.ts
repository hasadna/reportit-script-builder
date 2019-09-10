import { BlockType } from './enum';

export class BlockData {
  id: string;
  variableId: string;
  text: string;
  date: Date;
  type: BlockType;

  constructor(id: string, type: BlockType) {
    this.id = id;
    this.type = type;
  }

  isTextBlock(): boolean {
    return this.type === BlockType.Text;
  }

  isDateBlock(): boolean {
    return this.type === BlockType.Date;
  }

  isInputBlock(): boolean {
    return this.type === BlockType.Input;
  }
}
