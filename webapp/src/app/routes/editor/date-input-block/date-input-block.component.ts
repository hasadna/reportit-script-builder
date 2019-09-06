import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BlockData } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'date-input-block',
  templateUrl: './date-input-block.component.html',
  styleUrls: ['./date-input-block.component.scss'],
})
export class DateInputBlockComponent implements OnInit {
  input = new FormControl();
  @Input() block: BlockData;

  constructor(private blockService: BlockService) { }

  ngOnInit() {
    this.input.setValue(this.block.name, { emitEvent: false });
    this.input.valueChanges.subscribe(text => {
      this.block.name = text;
      this.blockService.updateBlock(this.block);
    });
  }
}
