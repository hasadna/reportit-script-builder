import { Component } from '@angular/core';

import { BlockType, OrganizationBlock, OrderArrow } from '@/core/types';
import { BlockService, YamlService } from '@/core/services';

@Component({
  selector: 'organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
})
export class OrganizationListComponent {
  constructor(
    private blockService: BlockService,
    public yamlService: YamlService,
  ) { }

  removeOrganization(index: number): void {
    this.yamlService.organizations.splice(index, 1);
  }

  addOrganization(): void {
    const organizationBlock = new OrganizationBlock(BlockType.Organization, null);
    this.yamlService.organizations.push(organizationBlock);
  }

  reorderBlock(direction: OrderArrow, index: number): void {
    this.blockService.reorder(direction, index, this.yamlService.organizations);
  }
}
