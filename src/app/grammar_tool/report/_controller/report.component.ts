import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { Baseconst } from '../../../share/base.constants';
import { Photo } from '../_model/photo';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ReportService } from '../_services/report.service';
import { Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { FilterMedia } from '../_model/filterObj';
import { DatePipe } from '@angular/common';
import { DelReportComponent } from './delReport.component';

@Component({
  selector: 'app-media',
  templateUrl: '../_views/report.component.html',
  styleUrls: ['../_views/report.component.scss', '../../../share/e-home.scss']
})
export class ReportComponent extends BaseComponent implements OnInit {
  heightMedia: string;
  picker: any;
  reports: any;
  selectedImage: string;
  tabIndex: number;
  filter: FilterMedia;
  pickerVideo: any;
  dateFormater: DatePipe;
  loading: boolean;

  constructor(public dialog: MdDialog,
    private reportService: ReportService,
    protected router: Router,
    public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
    console.log('start');
    this.reports = [];
    this.loading = false;
    this.loadReports();
  }
  ngOnInit() {
  }

  downloadCsv(report) {
    this.loading = true;
    this.reportService.downloadCsv(report.reportId).subscribe(res => {
      this.loading = false;
      console.log(res);
      if (res !== undefined && res !== null &&
        res.url !== undefined && res.url !== null) {
        //var newWindow = window.open(Baseconst.protocol + '://' + Baseconst.url + '/reportcsvpublic/'+res.url);
        const newWindow = window.open(Baseconst.getPartialBaseUrl() + '/reportcsvpublic/' + res.url);
      }
    });
  }

  loadReports() {
    this.loading = true;
    this.reportService.getReport().subscribe(res => {
      if (res.status === 'OK') {
        this.reports = res.response;
      } else {
        this.processStatusError(res.errors);
        console.error('Server error');
      }
      this.loading = false;
    });
  }

  deleteReport(m) {

  }

  delReport(p) {
    const dialogRef = this.dialog.open(DelReportComponent);
  }
}
