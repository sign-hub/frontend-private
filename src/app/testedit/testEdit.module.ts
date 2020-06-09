import {NgModule} from '@angular/core';
import {TestEditComponent} from './_controller/testEdit.component';
import {TestEditRouting} from './testEdit.routing';
import {SharedModule} from '../share/shared.module';
import {TestEditService} from './_services/testEdit.service';
import {TestEditDialogComponent} from './_controller/testEditDialog.component';
import {ConfigQuestionComponent} from './_controller/configQuestion.component';
import {DeleteQuestionComponent} from './_controller/delQuestion.component';
import { DragDropService, DragDropConfig, DragDropSortableService } from 'ng2-dnd';


@NgModule({
  imports: [
    TestEditRouting,
    SharedModule
  ],
  declarations: [TestEditComponent, TestEditDialogComponent,
    ConfigQuestionComponent, DeleteQuestionComponent],
  exports: [],
  providers: [TestEditService,
    DragDropService,
    DragDropConfig,
    DragDropSortableService],
  entryComponents: [TestEditDialogComponent, ConfigQuestionComponent, DeleteQuestionComponent]
})
export class TestEditModule {

}
