import { randstr64 } from 'rndmjs';
import { BlockType, BlockValidation } from './enum';
import { Case, WaitButton, WaitStepButton, Scenario, WithParent } from './interfaces';

export class Block implements WithParent {
  parent: WithParent;
  type: BlockType;
  id: string = randstr64(20);

  constructor(blockType: BlockType, parent: WithParent) {
    this.type = blockType;
    this.parent = parent;
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

export class VariableBlock extends Block {
  variable: string = '';
}

export class WaitInputBlock extends VariableBlock {
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

export class AnchorBlock extends Block {
  element: HTMLDivElement;
  update: () => void;
  destroy: () => void;
}

export class WaitButtonBlock extends VariableBlock {
  buttons: WaitButton[] = [];
}

export class WaitButtonStepBlock extends Block {
  buttons: WaitStepButton[] = [];
}

export class SwitchBlock extends AnchorBlock {
  arg: string;
  cases: Case[] = [];
}

export class SnippetBlock extends AnchorBlock {
  name: string = '';
  isDefault: boolean = false;
  steps: Block[] = [];
}

export class GotoBlock extends AnchorBlock {
  goto: string;
}

export class DoBlock extends VariableBlock {
  cmd: string;
  params: string;
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
