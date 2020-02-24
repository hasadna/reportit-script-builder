import { Component } from '@angular/core';

import { BlockType, InfocardBlock, OrderArrow } from '@/core/types';
import { BlockService, YamlService } from '@/core/services';

@Component({
  selector: 'infocard-list',
  templateUrl: './infocard-list.component.html',
  styleUrls: ['./infocard-list.component.scss'],
})
export class InfocardListComponent {
  constructor(
    private blockService: BlockService,
    public yamlService: YamlService,
  ) { }

  removeInfocard(index: number): void {
    this.yamlService.infocards.splice(index, 1);
  }

  addInfocard(): void {
    const infocardBlock = new InfocardBlock(BlockType.Infocard, null);
    this.yamlService.infocards.push(infocardBlock);
  }

  reorderBlock(direction: OrderArrow, index: number): void {
    this.blockService.reorder(direction, index, this.yamlService.infocards);
  }
}
