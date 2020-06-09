import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';
import { Baseconst } from '../../../share/base.constants';



const hostUrl = Baseconst.getPartialBaseUrl();
const HOSTURL = Baseconst.getPartialBaseUrl();

@Component({
  selector: 'ca-video-recording',
  templateUrl: '../_views/videoRecording.component.html',
  styleUrls: ['../_views/videoRecording.component.scss', '../../../share/base.scss']
})
export class VideoRecordingComponent extends BaseComponent implements OnInit {

  input: any;
  buttonSubmitState: boolean;

  constructor(public MatSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<VideoRecordingComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, MatSnackBar);
    this.input = this.data;
    if (this.input.options == undefined || this.input.options == null) {
      this.input.options = {};
    }
    if (!!this.input && !!this.input.value && this.input.value != undefined) {
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
    console.log(this.input.name);
  }

  setUploadType(value) {
    console.log('setUploadType');
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
