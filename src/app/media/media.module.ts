import { NgModule } from '@angular/core';

import { MediaComponent } from './_controller/media.component';
import { MediaRouting } from './media.routing';
import { SharedModule } from '../share/shared.module';
import {DialogPreviewComponent} from './_controller/preview.component';
import { UploadMediaComponent } from './_controller/uploadMedia.component';
import { MediaService } from './_services/media.service';
import { DelMediaComponent } from './_controller/delMedia.component';

@NgModule({
  imports: [
    MediaRouting,
    SharedModule
  ],
  declarations: [MediaComponent, DialogPreviewComponent, UploadMediaComponent, DelMediaComponent],
  exports: [],
  providers: [MediaService],
  entryComponents: [DialogPreviewComponent, UploadMediaComponent, DelMediaComponent]
})
export class MediaModule {
}
