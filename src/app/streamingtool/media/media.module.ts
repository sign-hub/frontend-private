import { NgModule } from '@angular/core';

import { MediaComponent } from './_controller/media.component';
import { MediaRouting } from './media.routing';
import { SharedModule } from '../../share/shared.module';
import { MediaService } from './_services/media.service';

import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import { OrderBy } from './orderby.pipe';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './_store/reducers';
import { VideoEffects } from './_store/effects/media.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../environments/environment';



@NgModule({
  imports: [
    MediaRouting,
    SharedModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    StoreModule.provideStore(reducer),
    EffectsModule.run(VideoEffects),
    !environment.production ?
    StoreDevtoolsModule.instrumentOnlyWithExtension() : []
  ],
  declarations: [MediaComponent, OrderBy],
  exports: [],
  providers: [MediaService],
})
export class MediaModule {
}
