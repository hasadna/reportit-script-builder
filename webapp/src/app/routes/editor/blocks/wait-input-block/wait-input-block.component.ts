import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { BlockValidation, WaitInputBlock, OrderArrow, SwitchBlock } from '@/core/types';
import { BlockService, NotificationService } from '@/core/services';

interface Checkbox {
  label: string;
  validation: BlockValidation;
}

@Component({
  selector: 'wait-input-block',
  templateUrl: './wait-input-block.component.html',
  styleUrls: ['./wait-input-block.component.scss'],
})
export class WaitInputBlockComponent implements OnInit, OnDestroy {
  input = new FormControl();
  switchBlockList: SwitchBlock[] = [];
  switchSub = new Subscription();
  isValidationOpen: boolean = false;
  checkboxes: Checkbox[] = [];
  label: string;
  @Input() block: WaitInputBlock;
  @Output() remove = new EventEmitter<void>();
  @Output() move = new EventEmitter<OrderArrow>();

  constructor(
    private blockService: BlockService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    if (this.block.validations.length > 0) {
      this.isValidationOpen = true;
    }
    this.label = this.block.isWaitDateBlock() ? 'Date' : 'Text';
    this.initValidation();
    this.input.setValue(this.block.variable, { emitEvent: false });
    this.blockService.variableBlockMap[this.block.id] = this.block;
    this.blockService.variableChanges.next();
    this.initSubs();
  }

  initSubs(): void {
    this.createSwitchLink();
    this.switchSub = this.blockService.switchChanges
      .pipe(debounceTime(0)) // ExpressionChangedAfterItHasBeenCheckedError fix
      .subscribe(() => {
        this.createSwitchLink();
      });
    this.input.valueChanges
      .pipe(debounceTime(100))
      .subscribe(value => {
        // When user is changing input
        this.block.variable = value;
        for (const switchBlock of this.switchBlockList) {
          // Update all switch blocks too
          switchBlock.arg = value;
        }
        for (const switchBlock of Object.values(this.blockService.switchBlockMap)) {
          switchBlock.update();
        }
        // In case new variable equals to one of switch args (updates all wait/do blocks)
        this.blockService.switchChanges.next();
      });
  }

  createSwitchLink(): void {
    // Get all child switch blocks, to be able to scroll to them
    this.switchBlockList = [];
    for (const switchBlock of Object.values(this.blockService.switchBlockMap)) {
      if (switchBlock.arg === this.block.variable) {
        this.switchBlockList.push(switchBlock);
      }
    }
  }

  initValidation(): void {
    this.checkboxes.push({
      label: 'מניעת משלוח הודעה ריקה',
      validation: BlockValidation.NoEmptyAnswer,
    });
    if (this.block.isWaitTextBlock()) {
      // Text validation only
      this.checkboxes.push({
        label: 'וידוא כתובת דוא"ל תקינה',
        validation: BlockValidation.EmailAddress,
      });
      this.checkboxes.push({
        label: "וידוא מספר טלפון תקין",
        validation: BlockValidation.PhoneNumber,
      });
      this.checkboxes.push({
        label: 'וידוא תשובה מספרית',
        validation: BlockValidation.Number,
      });
    }
    if (this.block.isWaitDateBlock()) {
      // Date validation only
      this.checkboxes.push({
        label: "וידוא תאריך תקין",
        validation: BlockValidation.Date,
      });
      this.checkboxes.push({
        label: "וידוא שעה תקינה",
        validation: BlockValidation.Hour,
      });
    }
  }

  validationToggle(): void {
    this.isValidationOpen = !this.isValidationOpen;
  }

  up(): void {
    this.move.emit(OrderArrow.Up);
  }

  down(): void {
    this.move.emit(OrderArrow.Down);
  }

  scroll(switchBlock: SwitchBlock): void {
    switchBlock.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  removeSelf(): void {
    if (this.switchBlockList.length > 0) {
      this.notificationService.warning('Please change all switch, which point to the wait');
    } else {
      this.remove.emit();
    }
  }

  ngOnDestroy() {
    this.switchSub.unsubscribe();
  }
}
