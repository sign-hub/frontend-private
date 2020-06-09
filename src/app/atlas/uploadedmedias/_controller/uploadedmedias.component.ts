import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { Baseconst } from '../../../share/base.constants';
import { Photo } from '../_model/photo';
import { MdDialog, MdDialogRef } from '@angular/material';
import { UploadedMediasService } from '../_services/uploadedmedias.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { FilterMedia } from '../_model/filterObj';
import { DatePipe } from '@angular/common';
import { DelReportComponent } from './delReport.component';
import { IMyDpOptions } from 'ng4-datepicker';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var jQuery: any;
declare var download: any;

@Component({
  selector: 'app-media',
  templateUrl: '../_views/uploadedmedias.component.html',
  styleUrls: ['../_views/uploadedmedias.component.scss', '../../../share/e-home.scss']
})
export class UploadedMediasComponent extends BaseComponent implements OnInit {
  heightMedia: string;
  picker: any;
  public medias: any = [];
  selectedImage: string;
  tabIndex: number;
  filter: FilterMedia;
  pickerVideo: any;
  dateFormater: DatePipe;
  loading: boolean;
  allMedias: any;
  filter_name: string;
  fileter_date: any;
  id: string;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
  };

  constructor(public dialog: MdDialog,
    private uploadedMediasService: UploadedMediasService,
    protected router: Router,
    protected route: ActivatedRoute,
    public ngZone: NgZone,
    private sanitizer: DomSanitizer,
    public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
    console.log('start');
    this.medias = [];
    this.loading = false;
    this.loadReports();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.loadReports();
    });
  }

  downloadCsv(report) {

  }

  loadReports() {
    this.loading = true;

    if (this.id !== undefined && this.id !== null && this.id !== 'false') {

      this.uploadedMediasService.getMediaById(this.id).subscribe(res => {
        this.loading = false;
        this.medias = jQuery.map(res.response.elements, (value, index) => {
          return [value];
        });
      });

    }
  }

  deleteReport(m) {

  }


  download(media) {
    const type = null;

    if (!!media.publicUrl) {

      this.uploadedMediasService.requestDownloadFile('/retrievePublic?code=' + media.publicUrl).subscribe(res => {
        const mediaData = new Blob([res.arrayBuffer()], { type: type });
        const reader = new (<any>window).FileReader();
        reader.readAsDataURL(mediaData);
        const myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
          console.log(mediaData);
          const url = window.URL.createObjectURL(mediaData);
          download(res.arrayBuffer(), media.mediaName, type);
          return 'success';
        };
        myReader.readAsDataURL(mediaData);
      });
    } else {
      this.uploadedMediasService.requestDownloadFile(media.mediaPath).subscribe(res => {
        const mediaData = new Blob([res.arrayBuffer()], { type: type });
        const reader = new (<any>window).FileReader();
        reader.readAsDataURL(mediaData);
        const myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
          console.log(mediaData);
          const url = window.URL.createObjectURL(mediaData);
          download(res.arrayBuffer(), media.mediaName, type);
          return 'success';
        };
        myReader.readAsDataURL(mediaData);

      });
    }


  }

  doFilter(event = null) {

    if (this.filter_name === undefined && (event === null || event.formatted === '')) {
      this.medias = this.allMedias;
      return;
    }

    this.medias = this.allMedias.filter((report) => {
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

}
