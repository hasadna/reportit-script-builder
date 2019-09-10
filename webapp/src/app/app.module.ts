import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EditorModule, JsonComponent } from '@/routes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared';

@NgModule({
  declarations: [
    AppComponent,
    JsonComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    EditorModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
