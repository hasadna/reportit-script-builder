import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.css']
})
export class TextBlockComponent implements OnInit {
  //@Input() text: string;
  @Input() data: Map<string, string>;
  @Output() outputEmitter = new EventEmitter<Map<string, string>>();
  controlName = new FormControl();

  constructor() { }

  ngOnInit() {
    this.controlName.setValue(this.data.get("text"), {emitEvent: false});
    this.controlName.valueChanges.subscribe(text => {
      this.data.set("text", text);
      this.outputEmitter.emit(this.data);
    })
  }

  getData(): Map<string, string> {
    return this.data;
  }
}
