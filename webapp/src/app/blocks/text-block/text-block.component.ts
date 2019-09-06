import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TextData } from '../../product-list/product-list.component';

@Component({
  selector: 'app-text-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.css']
})
export class TextBlockComponent implements OnInit {
  @Input() data: TextData;
  @Output() outputEmitter = new EventEmitter<TextData>();
  controlName = new FormControl();

  constructor() { }

  ngOnInit() {
    this.controlName.setValue(this.data.text, {emitEvent: false});
    this.controlName.valueChanges.subscribe(text => {
      this.data.text = text;
      this.outputEmitter.emit(this.data);
    })
  }
}
