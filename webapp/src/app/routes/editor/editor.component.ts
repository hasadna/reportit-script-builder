import { Component } from '@angular/core';

import { BlockService } from '@/core/services';

@Component({
  selector: 'page-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  constructor(public blockService: BlockService) { }
}
