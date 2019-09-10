import { Component, Input } from '@angular/core';

import { BlockData } from '@/core/types';
import { BlockService } from '@/core/services';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
})
export class BlockComponent {
  @Input() block: BlockData;

  constructor(public blockService: BlockService) { }
}
