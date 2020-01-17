import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Scenario } from '@/core/types';

@Component({
  selector: 'organization-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss'],
})
export class ScenarioComponent implements OnInit {
  textarea = new FormControl();
  isError: boolean = false;
  @Input() scenario: Scenario;
  @Output() upScenario = new EventEmitter<void>();
  @Output() downScenario = new EventEmitter<void>();
  @Output() deleteScenario = new EventEmitter<void>();

  constructor() {
    this.textarea.valueChanges.subscribe(value => {
      this.validateJson(value);
      this.scenario.json = value;
    });
  }

  validateJson(json: string): void {
    try {
      JSON.parse(json);
      this.isError = false;
    } catch (e) {
      this.isError = true;
    }
  }

  ngOnInit() {
    this.textarea.setValue(this.scenario.json, { emitEvent: false });
  }
}
