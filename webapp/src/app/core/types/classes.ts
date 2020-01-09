import { BlockType, BlockValidation } from './enum';
import { Case, WaitButton, WaitStepButton, Scenario } from './interfaces';

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

  isSnippetBlock(): boolean {
    return this.type === BlockType.Snippet;
  }

  isGotoBlock(): boolean {
    return this.type === BlockType.Goto;
  }

  isWaitButtonBlock(): boolean {
    return this.type === BlockType.WaitButton;
  }

  isWaitButtonStepBlock(): boolean {
    return this.type === BlockType.WaitButtonStep;
  }

  isDoBlock(): boolean {
    return this.type === BlockType.Do;
  }
}

export class SayBlock extends Block {
  say: string;
}

export class WaitVariableBlock extends Block {
  variable: string = '';
}

export class WaitInputBlock extends WaitVariableBlock {
  placeholder: string;
  validations: BlockValidation[] = [];
  validation: string;
  long: boolean = false;

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

export class SnippetBlock extends Block {
  name: string = '';
  isDefault: boolean = false;
  steps: Block[] = [];
}

export class GotoBlock extends Block {
  goto: string;
}

export class DoBlock extends Block {
  cmd: string;
  params: string;
  variable: string;
}

export class InfocardBlock extends Block {
  title: string;
  content: string;
  slug: string;
}

export class TaskTemplateBlock extends Block {
  title: string;
  description: string;
  infocardSlugs: string;
  slug: string;
}

export class OrganizationBlock extends Block {
  contactPerson1: string;
  contactPerson2: string;
  description: string;
  email1: string;
  email2: string;
  fax: string;
  mailAddress: string;
  organizationName: string;
  organizationType: string;
  phoneNumber1: string;
  phoneNumber2: string;
  phoneResponseDetails: string;
  receptionDetails: string;
  scenariosRelevancy: string;
  slug: string;
  websiteLabel1: string;
  websiteLabel2: string;
  websiteUrl1: string;
  websiteUrl2: string;
  scenarios: Scenario[] = [];
}
