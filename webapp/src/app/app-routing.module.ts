import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  EditorComponent,
  JsonComponent,
} from '@/routes';

const appRoutes: Routes = [
  { path: '', component: EditorComponent },
  { path: 'json', component: JsonComponent },
  { path: '**', component: EditorComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }
