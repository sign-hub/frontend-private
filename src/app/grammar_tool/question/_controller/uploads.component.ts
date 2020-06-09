import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Baseconst } from '../../../share/base.constants';


import { FileSelectDirective, FileUploader, FileItem } from 'ng2-file-upload';
import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';

const hostUrl = Baseconst.getPartialBaseUrl();
const HOSTURL = Baseconst.getPartialBaseUrl();

@Component({
  selector: 'ca-uploads',
  templateUrl: '../_views/uploads.component.html',
  styleUrls: ['../_views/uploads.component.scss', '../../../share/base.scss']
})
export class UploadsComponent extends BaseComponent implements OnInit {

  uploads = [
    { value: 'file', viewValue: 'File' },
    { value: 'pdf', viewValue: 'Pdf' },
    { value: 'foto', viewValue: 'Foto' },
    { value: 'video', viewValue: 'Video' },
    { value: 'tutti', viewValue: 'Tutti' }
  ];

  input: any;
  buttonSubmitState: boolean;

  constructor(public MatSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<UploadsComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, MatSnackBar);
    this.input = this.data;
  }

  ngOnInit() {
  }

  save() {
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

}
