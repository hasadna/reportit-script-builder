import { Block } from './classes';
import { BlockType } from './enum';

export interface BlockSelect {
  label: string;
  type: BlockType;
}

export interface Case {
  match: string;
  isDefault: boolean;
  steps: Block[];
}

export interface WaitButton {
  show: string;
  value: string;
}

export interface WaitStepButton {
  show: string;
  steps: Block[];
}

export interface Scenario {
  json: string;
}
