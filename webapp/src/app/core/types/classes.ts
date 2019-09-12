import { BlockType } from './enum';

export interface BlockDataJSON {
  id: string;
  variableId: string;
  text: string;
  date: Date;
  type: BlockType;
  order: number;
}

export class BlockData implements BlockDataJSON {
  id: string;
  variableId: string;
  text: string;
  date: Date;
  type: BlockType;
  order: number;

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

  static fromObject(block: BlockDataJSON): BlockData {
    const newBlock = new BlockData(block.id, block.type);
    return Object.assign(newBlock, block);
  }
}
