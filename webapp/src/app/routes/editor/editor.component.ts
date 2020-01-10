import { Component } from '@angular/core';

import { YamlService, LoadingService, BlockService } from '@/core/services';

@Component({
  selector: 'page-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  constructor(
    public yamlService: YamlService,
    public loadingService: LoadingService,
    private blockService: BlockService,
  ) {
    this.blockService.gotoBlockMap = {};
  }
}
