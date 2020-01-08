import { Component } from '@angular/core';

import { BlockType, TaskTemplateBlock, OrderArrow } from '@/core/types';
import { BlockService, YamlService } from '@/core/services';

@Component({
  selector: 'task-template-list',
  templateUrl: './task-template-list.component.html',
  styleUrls: ['./task-template-list.component.scss'],
})
export class TaskTemplateListComponent {
  constructor(
    private blockService: BlockService,
    public yamlService: YamlService,
  ) { }

  removeTaskTemplate(index: number): void {
    this.yamlService.taskTemplates.splice(index, 1);
  }

  addTaskTemplate(): void {
    const taskTemplateBlock = new TaskTemplateBlock(BlockType.TaskTemplate);
    this.yamlService.taskTemplates.push(taskTemplateBlock);
  }

  reorderBlock(direction: OrderArrow, index: number): void {
    this.blockService.reorder(direction, index, this.yamlService.taskTemplates);
  }
}
