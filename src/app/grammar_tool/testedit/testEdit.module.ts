import { DialogHyperlinkComponent } from './../dialogHyperlink/_controller/dialog-hyperlink.component';
import { NgModule } from '@angular/core';
import { TestEditComponent } from './_controller/testEdit.component';
import { TestEditRouting } from './testEdit.routing';
import { SharedModule } from '../../share/shared.module';
import { TestEditService } from './_services/testEdit.service';
import { DragDropService, DragDropConfig, DragDropSortableService } from 'ng2-dnd';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MediaService } from '../media/_services/media.service';
import { AdminService } from '../../admin/_service/admin.service';
import { ConfigGrammarComponent } from './_controller/configGrammar.component';
import { SimpleJoditComponent } from './_controller/jodit';


@NgModule({
  imports: [
    TestEditRouting,
    SharedModule
    // FroalaEditorModule.forRoot(),
    // FroalaViewModule.forRoot()
  ],
  declarations: [TestEditComponent, ConfigGrammarComponent, SimpleJoditComponent],
  exports: [],
  providers: [TestEditService,
    MediaService,
    AdminService,
    DragDropService,
    DragDropConfig,
    DragDropSortableService],
  entryComponents: [ConfigGrammarComponent]
})
export class TestEditModule {

}
