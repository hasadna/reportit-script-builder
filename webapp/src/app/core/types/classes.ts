import { BlockType, BlockValidation } from './enum';
import { Case, WaitButton, WaitStepButton } from './interfaces';

export class Block {
  type: BlockType;

  constructor(blockType: BlockType) {
    this.type = blockType;
  }

  isSayBlock(): boolean {
    return this.type === BlockType.Say;
  }

  isWaitDateBlock(): boolean {
    return this.type === BlockType.WaitDate;
  }

  isWaitTextBlock(): boolean {
    return this.type === BlockType.WaitText;
  }

  isWaitInputBlock(): boolean {
    return this.isWaitDateBlock() || this.isWaitTextBlock();
  }

  isSwitchBlock(): boolean {
    return this.type === BlockType.Switch;
  }
}

export class SayBlock extends Block {
  say: string;
}

export class WaitVariableBlock extends Block {
  variable: string;
}

export class WaitInputBlock extends WaitVariableBlock {
  placeholder: string;
  validations: BlockValidation[] = [];
  validation: string;

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
}

export class WaitButtonBlock extends WaitVariableBlock {
  buttons: WaitButton[] = [];
}

export class WaitButtonStepBlock extends Block {
  buttons: WaitStepButton[] = [];
}

export class SwitchBlock extends Block {
  arg: string;
  cases: Case[] = [];
}
