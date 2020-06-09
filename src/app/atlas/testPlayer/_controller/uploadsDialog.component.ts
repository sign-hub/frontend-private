import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-uploads-dialog',
  templateUrl: '../_views/uploadsDialog.component.html',
  styleUrls: ['../_views/uploadsDialog.component.scss', '../../../share/e-home.scss']
})


export class UploadsDialogComponent implements OnInit {

  entryQueue: any[];
  uploader: FileUploader;
  uploaded: Array<any>;
  alreadyUploaded: Array<any>;

  constructor(
    public thisDialogRef: MdDialogRef<UploadsDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    console.log(data);
    this.entryQueue = [...this.data['uploader'].queue];
    this.uploader = this.data['uploader'];
    this.uploaded = this.data['uploaded'].filter((item, pos) => {
      if (item) {
        return this.data['uploaded'].indexOf(item) === pos;
      }
    });
    this.alreadyUploaded = null;
    if(this.data['alreadyUploaded']!=undefined && this.data['alreadyUploaded']!=null){
      this.alreadyUploaded = this.data['alreadyUploaded'].filter((item, pos) => {
      if (item) {
        return this.data['alreadyUploaded'].indexOf(item) === pos;
      }
    });
    }
    
  }

  async ngOnInit() {

  }



  onCloseConfirm() {
    this.thisDialogRef.close(this.uploader);
  }

  onCloseCancel() {
    this.uploader.queue = [...this.entryQueue];
    this.thisDialogRef.close(this.uploader);
  }

}