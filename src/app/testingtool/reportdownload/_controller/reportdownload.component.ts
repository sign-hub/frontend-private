import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Baseconst } from '../../../share/base.constants';
import { ReportdownloadService } from '../_services/reportdownload.service';

@Component({
  selector: 'app-reportdownload',
  templateUrl: '../_views/reportdownload.component.html',
  styleUrls: ['../_views/reportdownload.component.scss', '../../../share/e-home.scss']
})
export class ReportdownloadComponent extends BaseComponent implements OnInit {

  reportId: string;
  loading: boolean;
  downloaded: boolean;

  constructor(
    protected router: Router,
    protected ngZone: NgZone,
    public mdSnackBar: MdSnackBar,
    private activaterRoute: ActivatedRoute,
    private reportDownloadService: ReportdownloadService
  ) {
    super(router, mdSnackBar);
    this.loading = false;
    this.downloaded = false;
  }


  ngOnInit() {
    this.reportId = this.activaterRoute.snapshot.paramMap.get('id');
    console.log(this.reportId)
    // this.downloadCsv(this.reportId);
  }

  downloadCsv() {
    this.loading = true;
    this.reportDownloadService.downloadCsv(this.reportId).subscribe(res => {
      this.loading = false;
      if (res !== undefined && res !== null &&
        res.code !== undefined && res.code !== null) {
        this.openSnackBar('Report Donloaded!')
        const newWindow = window.open(Baseconst.getPartialBaseUrl() + '/retrievePublic?code=' + res.code);
        this.downloaded = true;
      }
    },
      () => {
        this.openSnackBar('Could not Download Report')
      });
  }

  openSnackBar(message: string) {
    const snackBarOption = new MdSnackBarConfig();
    snackBarOption.duration = 3000;
    this.snackBar.open(message, '', snackBarOption);
  }

}
