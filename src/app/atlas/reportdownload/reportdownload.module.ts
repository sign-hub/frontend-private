import { NgModule } from '@angular/core';
import { ReportdownloadComponent } from './_controller/reportdownload.component';
import { SharedModule } from 'app/share/shared.module';
import { ReportDownloadRouting } from './reportdownload.router';
import { ReportdownloadService } from './_services/reportdownload.service';

@NgModule({
  imports: [
    ReportDownloadRouting,
    SharedModule
  ],
  declarations: [ReportdownloadComponent],
  exports: [],
  providers: [ReportdownloadService],
  entryComponents: [ReportdownloadComponent]
})
export class ReportdownloadModule { }
