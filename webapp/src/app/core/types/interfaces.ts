import { BlockData } from './classes';
import { BlockType } from './enum';

export interface BlockDataMap {
  [id: string]: BlockData;
}

export interface BlockSelect {
  label: string;
  type: BlockType;
}
