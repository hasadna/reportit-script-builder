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
import {
  InfocardBlockComponent,
  InfocardListComponent,
  TaskTemplateBlockComponent,
  TaskTemplateListComponent,
  OrganizationBlockComponent,
  OrganizationListComponent,
  ScenarioComponent,
} from './meta-blocks';

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
    InfocardBlockComponent,
    InfocardListComponent,
    TaskTemplateBlockComponent,
    TaskTemplateListComponent,
    OrganizationBlockComponent,
    OrganizationListComponent,
    ScenarioComponent,
  ],
})
export class EditorModule { }
