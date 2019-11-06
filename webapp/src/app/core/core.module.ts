import { NgModule } from '@angular/core';

import {
  NotificationService,
  BlockService,
  ScreenService,
} from './services';

@NgModule({
  providers: [
    NotificationService,
    BlockService,
    ScreenService,
  ],
})
export class CoreModule { }
