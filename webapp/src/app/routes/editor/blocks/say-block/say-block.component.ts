import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SayBlock } from '@/core/types';

@Component({
  selector: 'say-block',
  templateUrl: './say-block.component.html',
  styleUrls: ['./say-block.component.scss'],
})
export class SayBlockComponent implements OnInit {
  textarea = new FormControl();
  @Input() block: SayBlock;
  @Output() remove = new EventEmitter<void>();

  ngOnInit() {
    this.textarea.setValue(this.block.say, { emitEvent: false });
    this.textarea.valueChanges.subscribe(text => {
      this.block.say = text;
    });
  }
}
