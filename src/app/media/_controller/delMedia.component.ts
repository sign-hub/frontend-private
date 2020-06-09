import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { BaseComponent } from '../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-del-media',
  templateUrl: '../_views/delMedia.component.html',
  styleUrls: ['../_views/delMedia.component.scss']
})
export class DelMediaComponent extends BaseComponent implements OnInit {
  uploader: FileUploader;
  buttonSubmitState: boolean;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              public dialogRef: MdDialogRef<DelMediaComponent>) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
  }
}
