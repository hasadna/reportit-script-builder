import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OrganizationBlock, OrderArrow } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'organization-block',
  templateUrl: './organization-block.component.html',
  styleUrls: ['./organization-block.component.scss'],
})
export class OrganizationBlockComponent {
  @Input() block: OrganizationBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  constructor(private blockService: BlockService) { }

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }

  upScenario(index: number): void {
    this.blockService.reorder(OrderArrow.Up, index, this.block.scenarios);
  }

  downScenario(index: number): void {
    this.blockService.reorder(OrderArrow.Down, index, this.block.scenarios);
  }

  addScenario(): void {
    this.block.scenarios.unshift({ json: '{}' });
  }

  deleteScenario(index: number): void {
    this.block.scenarios.splice(index, 1);
  }
}
