import { NgModule } from '@angular/core';

import { MediaComponent } from './_controller/media.component';
import { MediaRouting } from './media.routing';
import { SharedModule } from '../../share/shared.module';
import {DialogPreviewComponent} from './_controller/preview.component';
import { UploadMediaComponent } from './_controller/uploadMedia.component';
import { MediaService } from './_services/media.service';
import { DelMediaComponent } from './_controller/delMedia.component';

import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import { UploadFolder } from './_controller/uploadFolder.component';

@NgModule({
  imports: [
    MediaRouting,
    SharedModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  declarations: [MediaComponent, DialogPreviewComponent, UploadMediaComponent, DelMediaComponent, UploadFolder],
  exports: [],
  providers: [MediaService],
  entryComponents: [DialogPreviewComponent, UploadMediaComponent, DelMediaComponent, UploadFolder]
})
export class MediaModule {
}
