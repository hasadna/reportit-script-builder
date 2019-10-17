import { NgModule } from '@angular/core';

import { SharedModule } from '@/shared';
import { EditorComponent } from './editor.component';
import { BlockListComponent } from './block-list';
import { SnippetsComponent } from './snippets';
import { AddBlockComponent } from './add-block';
import {
  SayBlockComponent,
  WaitInputBlockComponent,
  BlockCheckboxComponent,
  SwitchBlockComponent,
  SnippetBlockComponent,
  GotoBlockComponent,
  DoBlockComponent,
  WaitButtonBlockComponent,
  WaitButtonStepBlockComponent,
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
    SnippetBlockComponent,
    GotoBlockComponent,
    DoBlockComponent,
    WaitButtonBlockComponent,
    WaitButtonStepBlockComponent,
    BlockCheckboxComponent,
    BlockListComponent,
    SnippetsComponent,
    AddBlockComponent,
  ],
})
export class EditorModule { }
