import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BlockData } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'text-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.scss'],
})
export class TextBlockComponent implements OnInit {
  textarea = new FormControl();
  @Input() block: BlockData;

  constructor(private blockService: BlockService) { }

  ngOnInit() {
    this.textarea.setValue(this.block.text, { emitEvent: false });
    this.textarea.valueChanges.subscribe(text => {
      this.block.text = text;
      this.blockService.updateBlock(this.block);
    });
  }
}
