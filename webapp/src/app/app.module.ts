import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EditorModule, YamlComponent, LoginComponent } from '@/routes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared';
import { FirebaseModule } from './import';

@NgModule({
  declarations: [
    AppComponent,
    YamlComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    EditorModule,
    FirebaseModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
