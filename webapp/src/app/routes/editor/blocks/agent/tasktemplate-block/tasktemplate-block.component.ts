import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TaskTemplateBlock, OrderArrow } from '@/core/types';

@Component({
  selector: 'tasktemplate-block',
  templateUrl: './tasktemplate-block.component.html',
  styleUrls: ['./tasktemplate-block.component.scss'],
})
export class TaskTemplateBlockComponent {
  @Input() block: TaskTemplateBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }
}
