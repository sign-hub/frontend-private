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

  selected = 'tutti';

  uploads = [
    { value: 'tutti', viewValue: 'Tutti' },
    { value: 'file', viewValue: 'File' },
    { value: 'pdf', viewValue: 'Pdf' },
    { value: 'foto', viewValue: 'Foto' },
    { value: 'video', viewValue: 'Video' }
  ];

  input: any;
  buttonSubmitState: boolean;

  constructor(public MatSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<UploadsComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, MatSnackBar);
    this.input = this.data;
    console.log(this.data);
    if (this.input.options == undefined || this.input.options == null) {
      this.input.options = {};
    }
    if (!!this.input && !!this.input.value && this.input.value != undefined) {
      if (this.input.value == undefined || this.input.value == null)
        this.input.value = 'tutti';
      this.selected = this.input.value;
      this.setUploadType(this.input.value);
      this.input.viewValue = this.input.value.charAt(0).toUpperCase() + this.input.value.substr(1);
    }
  }

  ngOnInit() {

  }

  save() {
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
    console.log(this.input.name)
  }

  setUploadType(value) {
    if (value == undefined || value == null)
      value = 'tutti';
    this.input.groupName = value.charAt(0).toUpperCase() + value.substr(1);
    this.input.value = value;
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }
  changeNotToSave() {
    this.input.notToSave = !this.input.notToSave;
  }

}
