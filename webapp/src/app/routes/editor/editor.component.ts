import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { YamlService, LoadingService, BlockService } from '@/core/services';

@Component({
  selector: 'page-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnDestroy {
  constArea = new FormControl();
  switchSub = new Subscription();
  yamlSub = new Subscription();
  constructor(
    public yamlService: YamlService,
    public loadingService: LoadingService,
    public blockService: BlockService,
  ) {
    this.blockService.update();

    // Switch block can't update itself because of the error
    this.switchSub = this.blockService.switchChanges
      .pipe(debounceTime(0)) // ExpressionChangedAfterItHasBeenCheckedError fix
      .subscribe(switchBlock => {
        if (switchBlock) {
          switchBlock.update();
        }
      });

    this.initConst();
    this.yamlSub = this.yamlService.yamlChanges.subscribe(() => {
      this.initConst();
    });
    this.constArea.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value: string) => {
        this.yamlService.constants = value.split(',').map(constant => constant.trim());
        this.blockService.variableChanges.next();
      });
  }

  initConst(): void {
    if (this.yamlService.constants) {
      this.constArea.setValue(this.yamlService.constants.join(', '), { emitEvent: false });
    }
  }

  ngOnDestroy() {
    this.switchSub.unsubscribe();
    this.yamlSub.unsubscribe();
  }
}
