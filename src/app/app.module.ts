import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TestConsoleComponent } from './test-console/test-console.component';
import { StudyService } from './study.service';
import { StudyModule } from './study/study.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TestConsoleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StudyModule
  ],
  providers: [StudyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
