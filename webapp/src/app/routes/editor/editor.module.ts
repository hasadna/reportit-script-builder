import { NgModule } from '@angular/core';

import { SharedModule } from '@/shared';
import { EditorComponent } from './editor.component';
import { TextBlockComponent } from './text-block';
import { DateInputBlockComponent } from './date-input-block';
import { TextInputBlockComponent } from './text-input-block';
import { BlockComponent } from './block';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    EditorComponent,
    BlockComponent,
    TextBlockComponent,
    DateInputBlockComponent,
    TextInputBlockComponent,
  ],
})
export class EditorModule { }
