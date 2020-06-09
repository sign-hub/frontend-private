import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportdownloadComponent } from './_controller/reportdownload.component';

const routes: Routes = [
	{ path: '', component: ReportdownloadComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportDownloadRouting { }