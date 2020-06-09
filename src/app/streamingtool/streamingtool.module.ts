import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StreamingToolRouting } from './streamingtool.routing';
import { StreamingToolComponent } from './_controller/streamingtool.component';
import { SharedModule } from '../share/shared.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { StreamingToolService } from './_service/streamingtool.service';

@NgModule({

   providers: [
     BaseRequestOptions,
     MockBackend,
     {
       provide: Http,
       deps: [MockBackend, BaseRequestOptions],
       useFactory : MockLoader

     },
     StreamingToolService,
  ],
  imports: [
    CommonModule,
    SharedModule,
    StreamingToolRouting,
  ],
  declarations: [
    StreamingToolComponent,
  ]
})

export class StreamingToolModule { }

export function MockLoader(backend, options){
  return new Http(backend, options);
}