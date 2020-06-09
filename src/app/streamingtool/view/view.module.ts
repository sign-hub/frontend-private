import { NgModule } from '@angular/core';

import { ViewComponent } from './_controller/view.component';
import { ViewRouting } from './view.routing';
import { SharedModule } from '../../share/shared.module';
import { ViewService } from './_services/view.service';

import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import { VgStreamingModule } from "videogular2/streaming";
import { ShareButtonsModule } from 'ngx-sharebuttons';


@NgModule({
  imports: [
    ViewRouting,
    SharedModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    ShareButtonsModule
  ],
  declarations: [ViewComponent],
  exports: [],
  providers: [ViewService],
})
export class ViewModule {
}
