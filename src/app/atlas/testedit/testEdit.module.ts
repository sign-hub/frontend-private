import { NgModule } from '@angular/core';
import { TestEditComponent } from './_controller/testEdit.component';
import { TestEditRouting } from './testEdit.routing';
import { SharedModule } from '../../share/shared.module';
import { TestEditService } from './_services/testEdit.service';
import { TestEditDialogComponent } from './_controller/testEditDialog.component';
import { ConfigQuestionComponent } from './_controller/configQuestion.component';
import { DeleteQuestionComponent } from './_controller/delQuestion.component';
import { DiscardChangesComponent } from './_controller/discardChanges.component';
import { ImportQuestionComponent } from './_controller/importQuestion.component';
import { DragDropService, DragDropConfig, DragDropSortableService } from 'ng2-dnd';
import { CanDeactivateGuard } from '../../share/guards/can-deactivate-guard.service';
import { ConfigContentProviders } from './_controller/configContentProviders.component';
import { AdminService } from '../../admin/_service/admin.service';

import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
  imports: [
    TestEditRouting,
    SharedModule,
    MyDatePickerModule
  ],
  declarations: [TestEditComponent, TestEditDialogComponent,
    ConfigQuestionComponent, DeleteQuestionComponent, ImportQuestionComponent, DiscardChangesComponent, ConfigContentProviders],
  exports: [],
  providers: [TestEditService,
    DragDropService,
    DragDropConfig,
    AdminService,
    DragDropSortableService, CanDeactivateGuard],
  entryComponents: [TestEditDialogComponent, ConfigQuestionComponent, DeleteQuestionComponent, ImportQuestionComponent, DiscardChangesComponent, ConfigContentProviders]
})
export class TestEditModule {

}
