import { NgModule } from '@angular/core';

import {
  NotificationService,
  BlockService,
  FirebaseService,
  AuthService,
  AuthGuard,
  YamlService,
  LoadingService,
} from './services';

@NgModule({
  providers: [
    NotificationService,
    BlockService,
    AuthService,
    AuthGuard,
    FirebaseService,
    YamlService,
    LoadingService,
  ],
})
export class CoreModule { }
