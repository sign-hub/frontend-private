import { NgModule } from '@angular/core';
import { SharedModule } from '../../share/shared.module';
import { TestPlayerComponent } from './_controller/testPlayer.component';
import { UserInfoComponent } from './_controller/userInfo.component';
import { FinishedRaportDialog } from './_controller/FinishedRaportDialog.component';

import { TestPlayerRouting } from './testPlayer.routing';
import { MediaService } from '../media/_services/media.service';
import { TestPlayerService } from './_services/testPlayer.service';
import { ResizableModule } from 'angular-resizable-element';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { UploadsDialogComponent } from './_controller/uploadsDialog.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    TestPlayerRouting,
    SharedModule,
    ResizableModule,
    ReactiveFormsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [TestPlayerComponent, UserInfoComponent, UploadsDialogComponent, FinishedRaportDialog,
  ],
  exports: [],
  providers: [MediaService, TestPlayerService],
  entryComponents: [UserInfoComponent, UploadsDialogComponent, FinishedRaportDialog]
})
export class TestPlayerModule {
}
