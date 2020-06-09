import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { MediaComponent } from './media.component';
import { Photo } from '../_model/photo';
import { FileSelectDirective, FileUploader, FileItem } from 'ng2-file-upload';
import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { BaseComponent } from '../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Baseconst } from '../../share/base.constants';

@Component({
  selector: 'app-dialog-upload',
  templateUrl: '../_views/uploadMedia.component.html',
  styleUrls: ['../_views/uploadMedia.component.scss', '../../share/base.scss']
})
export class UploadMediaComponent extends BaseComponent implements OnInit {
  uploader: FileUploader;
  buttonSubmitState: boolean;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<UploadMediaComponent>) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
    this.initUploader();
  }

  initUploader() {
    const token: string = localStorage.getItem('token');
    this.uploader = new FileUploader({
      //url: Baseconst.protocol + '://' + Baseconst.url + '/media'
      url: Baseconst.getPartialBaseUrl() + '/media'
    });
    this.uploader.setOptions({ headers: [{ name: 'authtoken', value: token }] });
    this.uploader.onAfterAddingFile = (item: FileItem) => {
      // if (item.file.size > 3145728 ||
      //   (item.file.type !== 'image/jpeg' && item.file.type !== 'image/png' && item.file.type !== 'image/jpg')) {
      //   this.uploader.removeFromQueue(item);
      //   this.openSnackBar('File upload not format file!');
      // }
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.openSnackBar('Upload media successful!');
      this.dialogRef.close('OK');
    };
  }
}
