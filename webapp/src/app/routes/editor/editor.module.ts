import { NgModule } from '@angular/core';

import { SharedModule } from '@/shared';
import { EditorComponent } from './editor.component';
import { BlockListComponent } from './block-list';
import { AddBlockComponent } from './add-block';
import {
  SayBlockComponent,
  WaitInputBlockComponent,
  BlockCheckboxComponent,
  SwitchBlockComponent,
} from './blocks';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    EditorComponent,
    SayBlockComponent,
    WaitInputBlockComponent,
    SwitchBlockComponent,
    BlockCheckboxComponent,
    BlockListComponent,
    AddBlockComponent,
  ],
})
export class EditorModule { }
