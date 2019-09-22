import { Component, Input, OnInit } from '@angular/core';

import { BlockData, BlockValidation } from '@/core/types';
import { BlockService } from '@/core/services';

interface Checkbox {
  label: string;
  validation: BlockValidation;
}

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
})
export class BlockComponent implements OnInit {
  isValidationOpen: boolean = false;
  checkboxes: Checkbox[] = [];
  @Input() block: BlockData;

  constructor(public blockService: BlockService) { }

  ngOnInit() {
    this.initValidation();
  }

  initValidation(): void {
    this.checkboxes.push({
      label: 'Verify no empty answer',
      validation: BlockValidation.NoEmptyAnswer,
    });
    if (this.block.isInputBlock()) {
      // Input validation only
      this.checkboxes.push({
        label: "Verify it's a valid email address",
        validation: BlockValidation.EmailAddress,
      });
      this.checkboxes.push({
        label: "Verify it's a valid phone number",
        validation: BlockValidation.PhoneNumber,
      });
    }
    if (this.block.isDateBlock()) {
      // Date validation only
      this.checkboxes.push({
        label: "Verify it's a valid date",
        validation: BlockValidation.Date,
      });
      this.checkboxes.push({
        label: "Verify it's a valid hour",
        validation: BlockValidation.Hour,
      });
    }
  }

  validationToggle(): void {
    this.isValidationOpen = !this.isValidationOpen;
  }
}
