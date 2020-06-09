import { NgModule } from '@angular/core';

import { ReportComponent } from './_controller/report.component';
import { ReportRouting } from './report.routing';
import { SharedModule } from '../../share/shared.module';
import { ReportService } from './_services/report.service';
import { DelReportComponent } from './_controller/delReport.component';

@NgModule({
  imports: [
    ReportRouting,
    SharedModule
  ],
  declarations: [ReportComponent, DelReportComponent],
  exports: [],
  providers: [ReportService],
  entryComponents: [DelReportComponent]
})
export class ReportModule {
}
