import { Block, WaitButtonStepBlock } from './classes';
import { BlockType } from './enum';

export interface BlockSelect {
  label: string;
  type: BlockType;
}

export interface Case extends WithParent{
  match: string;
  isDefault: boolean;
  steps: Block[];
}

export interface WaitButton {
  show: string;
  value: string;
}

export interface WaitStepButton extends WithParent {
  show: string;
  steps: Block[];
}

export interface Scenario {
  json: string;
}

export interface WithParent {
  parent: WithParent;
}
