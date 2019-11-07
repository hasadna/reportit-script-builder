import { Component } from '@angular/core';

import { ScreenService } from '@/core/services';

const SHIFT_WIDTH = 49;

@Component({
  selector: 'page-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  grid: number[] = [];

  constructor(
    private screenService: ScreenService,
  ) {
    this.update();
    this.screenService.resizeChanges.subscribe(() => this.update());
  }

  update(): void {
    this.grid = [];
    const amountOfLines: number = Math.ceil(this.screenService.width / SHIFT_WIDTH);
    for (let i = 0; i <= amountOfLines; i++) {
      this.grid.push(i);
    }
  }
}
