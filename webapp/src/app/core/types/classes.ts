import { BlockType, BlockValidation } from './enum';

export class BlockData {
  id: string;
  variableId: string;
  text: string;
  date: Date;
  type: BlockType;
  order: number;
  validations: BlockValidation[] = [];

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

  setIsChecked(validation: BlockValidation, isChecked: boolean): void {
    if (isChecked) {
      if (!this.validations.includes(validation)) {
        this.validations.push(validation);
      }
    } else {
      const index: number = this.validations.indexOf(validation);
      if (index !== -1) {
        this.validations.splice(index, 1);
      }
    }
  }

  getIsChecked(validation: BlockValidation): boolean {
    return this.validations.includes(validation);
  }

  static fromObject(block: BlockData): BlockData {
    const newBlock = new BlockData(block.id, block.type);
    return Object.assign(newBlock, block);
  }
}
