import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@/import';
import { HeaderComponent } from './header';
import { LoadingComponent } from './loading';

const ExportDeclarations = [
  HeaderComponent,
  LoadingComponent,
];
const ExportModules = [
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  CommonModule,
  MaterialModule,
];

@NgModule({
  imports: ExportModules,
  declarations: [
    ...ExportDeclarations,
  ],
  exports: [
    ...ExportDeclarations,
    ...ExportModules,
  ],
})
export class SharedModule { }
