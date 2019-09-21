import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
} from '@angular/material';

const MaterialImports = [
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
];

@NgModule({
  imports: MaterialImports,
  declarations: [],
  providers: [],
  exports: MaterialImports,
})
export class MaterialModule { }
