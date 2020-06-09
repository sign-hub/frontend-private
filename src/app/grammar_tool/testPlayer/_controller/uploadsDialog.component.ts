import { Component, Inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { Router } from '@angular/router';
import { MD_DIALOG_DATA, MdSnackBar, MdDialogRef } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-uploads-dialog',
  templateUrl: '../_views/uploadsDialog.component.html',
  styleUrls: ['../_views/uploadsDialog.component.scss', '../../../share/e-home.scss']
})


export class UploadsDialogComponent implements OnInit {

  entryQueue: any[];
  uploader: FileUploader;

  constructor(
    public thisDialogRef: MdDialogRef<UploadsDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.entryQueue = [...data.queue];
    this.uploader = data;
  }

  ngOnInit() {
  }

  onCloseConfirm() {
    this.thisDialogRef.close(this.uploader);
  }

  onCloseCancel() {
    this.uploader.queue = [...this.entryQueue];
    this.thisDialogRef.close(this.uploader);
  }

}