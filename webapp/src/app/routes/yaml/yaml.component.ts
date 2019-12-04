import { Component } from '@angular/core';

import { YamlService, LoadingService } from '@/core/services';

@Component({
  selector: 'page-yaml',
  templateUrl: './yaml.component.html',
  styleUrls: ['./yaml.component.scss'],
})
export class YamlComponent {
  constructor(
    public yamlService: YamlService,
    public loadingService: LoadingService,
  ) { }
}
