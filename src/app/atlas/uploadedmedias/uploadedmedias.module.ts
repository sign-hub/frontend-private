import { NgModule } from '@angular/core';

import { UploadedMediasComponent } from './_controller/uploadedmedias.component';
import { UploadedMediasRouting } from './uploadedmedias.routing';
import { SharedModule } from '../../share/shared.module';
import { UploadedMediasService } from './_services/uploadedmedias.service';
import { DelReportComponent } from './_controller/delReport.component';

import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
  imports: [
    UploadedMediasRouting,
    SharedModule,
    MyDatePickerModule
  ],
  declarations: [UploadedMediasComponent, DelReportComponent],
  exports: [],
  providers: [UploadedMediasService],
  entryComponents: [DelReportComponent]
})
export class UploadedMediasModule {
}
