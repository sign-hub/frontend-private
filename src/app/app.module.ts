import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routes } from './app.routing';
import { RouterModule } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { AuthenModule } from './authen/authen.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomRequestOptions } from './share/customRequestOptions';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { VgStreamingModule } from 'videogular2/streaming';

import { ShareButtonsModule } from 'ngx-sharebuttons';



/*import { CKEditorModule } from 'ng2-ckeditor';*/


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HomeModule,
    AuthenModule,
    BrowserAnimationsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule/*,
    CKEditorModule*/,
    VgStreamingModule,
    ShareButtonsModule.forRoot(),
  ],
  providers: [{ provide: RequestOptions, useClass: CustomRequestOptions }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
