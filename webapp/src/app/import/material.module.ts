import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
  MatInputModule,
  MatCardModule,
} from '@angular/material';

const MaterialImports = [
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
  MatInputModule,
  MatCardModule,
];

@NgModule({
  imports: MaterialImports,
  declarations: [],
  providers: [],
  exports: MaterialImports,
})
export class MaterialModule { }
