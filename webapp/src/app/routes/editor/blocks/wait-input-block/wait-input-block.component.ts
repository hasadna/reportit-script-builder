import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BlockValidation, WaitInputBlock } from '@/core/types';

interface Checkbox {
  label: string;
  validation: BlockValidation;
}

@Component({
  selector: 'wait-input-block',
  templateUrl: './wait-input-block.component.html',
  styleUrls: ['./wait-input-block.component.scss'],
})
export class WaitInputBlockComponent implements OnInit {
  isValidationOpen: boolean = false;
  checkboxes: Checkbox[] = [];
  label: string;
  @Input() block: WaitInputBlock;
  @Output() remove = new EventEmitter<void>();

  ngOnInit() {
    if (this.block.validations.length > 0) {
      this.isValidationOpen = true;
    }
    this.label = this.block.isWaitDateBlock() ? 'Date' : 'Text';
    this.initValidation();
  }

  initValidation(): void {
    this.checkboxes.push({
      label: 'Verify no empty answer',
      validation: BlockValidation.NoEmptyAnswer,
    });
    if (this.block.isWaitTextBlock()) {
      // Text validation only
      this.checkboxes.push({
        label: "Verify it's a valid email address",
        validation: BlockValidation.EmailAddress,
      });
      this.checkboxes.push({
        label: "Verify it's a valid phone number",
        validation: BlockValidation.PhoneNumber,
      });
    }
    if (this.block.isWaitDateBlock()) {
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
