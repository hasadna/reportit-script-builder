import { Component } from '@angular/core';

import { YamlService, LoadingService } from '@/core/services';

@Component({
  selector: 'page-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  constructor(
    public yamlService: YamlService,
    public loadingService: LoadingService,
  ) { }
}
