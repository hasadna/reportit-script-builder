import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import { GotoBlock, OrderArrow, SnippetBlock } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'goto-block',
  templateUrl: './goto-block.component.html',
  styleUrls: ['./goto-block.component.scss'],
})
export class GotoBlockComponent implements OnInit, AfterViewInit {
  // Does the goto points to nowhere
  isEnd: boolean = false;
  @ViewChild('goto', { static: false }) blockRef: ElementRef;
  @Input() block: GotoBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  constructor(
    public blockService: BlockService,
  ) { }

  ngOnInit() {
    this.getSnippet();
    this.block.update = () => this.getSnippet();
    this.block.destroy = () => this.removeSelf();
    this.blockService.gotoBlockMap[this.block.id] = this.block;
  }

  ngAfterViewInit() {
    this.block.element = this.blockRef.nativeElement;
    this.blockService.gotoChanges.next();
  }

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }

  getSnippet(): void {
    this.isEnd = true;
    for (const block of this.blockService.blockList) {
      const snippet = block as SnippetBlock;
      if (snippet.name === this.block.goto) {
        this.isEnd = false;
      }
    }
  }

  select(snippet: SnippetBlock): void {
    this.block.goto = snippet.name;
    this.blockService.gotoChanges.next();
    this.getSnippet();
  }

  removeSelf(): void {
    this.remove.emit();
    delete this.blockService.gotoBlockMap[this.block.id];
    this.blockService.gotoChanges.next();
  }
}
