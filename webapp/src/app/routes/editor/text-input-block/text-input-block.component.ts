import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BlockData } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'text-input-block',
  templateUrl: './text-input-block.component.html',
  styleUrls: ['./text-input-block.component.scss'],
})
export class TextInputBlockComponent implements OnInit {
  input = new FormControl();
  @Input() block: BlockData;

  constructor(private blockService: BlockService) { }

  ngOnInit() {
    this.input.setValue(this.block.variableId, { emitEvent: false });
    this.input.valueChanges.subscribe(text => {
      this.block.variableId = text;
      this.blockService.updateBlock(this.block);
    });
  }
}
