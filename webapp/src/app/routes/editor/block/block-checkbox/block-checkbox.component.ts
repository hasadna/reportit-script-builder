import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BlockData, BlockValidation } from '@/core/types';

@Component({
  selector: 'block-checkbox',
  templateUrl: './block-checkbox.component.html',
})
export class BlockCheckboxComponent implements OnInit {
  checkbox = new FormControl();
  @Input() block: BlockData;
  @Input() validation: BlockValidation;

  constructor() {
    this.checkbox.valueChanges.subscribe(isChecked => {
      this.block.setIsChecked(this.validation, isChecked);
    });
  }

  ngOnInit() {
    if (this.block.getIsChecked(this.validation)) {
      this.checkbox.setValue(true, { emitEvent: false });
    }
  }
}
