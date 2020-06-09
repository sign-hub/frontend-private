import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { Baseconst } from '../../../share/base.constants';
import { Photo } from '../_model/photo';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ReportService } from '../_services/report.service';
import { NavigationExtras, Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { FilterMedia } from '../_model/filterObj';
import { DatePipe } from '@angular/common';
import { DelReportComponent } from './delReport.component';
import { IMyDpOptions } from 'ng4-datepicker';


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
  allReports: any;
  filter_name: string;
  fileter_date: any;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
  };

  constructor(public dialog: MdDialog,
    private reportService: ReportService,
    protected router: Router,
    protected ngZone: NgZone,
    public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
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
        const newWindow = window.open(Baseconst.getPartialBaseUrl() + '/reportcsvpublic/' + res.url);
      }
    });
  }

  edit(e) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: e.reportTestId,
        preview: false,
        report_id: e.reportId
      }
    };
    this.router.navigate(['/home/atlas/testplayer'], navigationExtras);

    // this.reportService.getReportById(e.reportId).subscribe(res => {
    //   console.log(res);
    // });
  }

  // copy(report) {
  //   const baseUrl = window.location.href.replace(/report/, "")
  //   const url = `${baseUrl}reportdownload/${report.reportId}`;
  //   let selBox = document.createElement('textarea');
  //   selBox.style.position = 'fixed';
  //   selBox.style.left = '0';
  //   selBox.style.top = '0';
  //   selBox.style.opacity = '0';
  //   selBox.value = url;
  //   document.body.appendChild(selBox);
  //   selBox.focus();
  //   selBox.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(selBox);
  //   this.openSnackBar('link copied to clipboard');
  // }

  loadReports() {
    this.loading = true;
    this.reportService.getReport().subscribe(res => {
      if (res.status === 'OK') {
        this.ngZone.run(() => {
          this.reports = res.response;
          this.allReports = res.response;
          console.log(res)
        });
      } else {
        this.processStatusError(res.errors);
        console.error('Server error');
      }
      this.loading = false;
    });
  }

  deleteReport(m) {

  }

  doFilter(event = null) {

    if (this.filter_name == undefined && (event == null || event.formatted == '')) {
      this.reports = this.allReports;
      return;
    }

    this.reports = this.allReports.filter((report) => {
      if (!!this.filter_name && report.reportTestName.toLowerCase().indexOf(this.filter_name.toLowerCase()) !== -1) {

        const date = report.reportDate.split('_');
        if (!!event && event.formatted != '' && event.formatted != date[0] + '/' + date[1] + '/' + date[2] + '/') {
          return false;
        }
        return true;
      } else {
        const date = report.reportDate.split('_');
        if (!!event && event.formatted != '' && event.formatted == date[0] + '/' + date[1] + '/' + date[2]) {
          return true;
        }
        return false;
      }
    });
  }

  delReport(p) {
    const dialogRef = this.dialog.open(DelReportComponent);
  }

  showMedia(e) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: e.reportId
      }
    };
    this.router.navigate(['/home/atlas/uploadedmedias'], navigationExtras);
  }

  openSnackBar(message: string) {
    const snackBarOption = new MdSnackBarConfig();
    snackBarOption.duration = 3000;
    this.snackBar.open(message, '', snackBarOption);
  }


}
