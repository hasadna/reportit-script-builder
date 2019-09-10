import { NgModule } from '@angular/core';

import {
  NotificationService,
  BlockService,
} from './services';

@NgModule({
  providers: [
    NotificationService,
    BlockService,
  ],
})
export class CoreModule { }
