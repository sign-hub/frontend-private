import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Location } from '@angular/common';


@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/FinishedRaportDialog.html',
  styleUrls: ['../_views/FinishedRaportDialog.scss', '../../../share/base.scss']
})
export class FinishedRaportDialog extends BaseComponent implements OnInit {

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    private location: Location,
    public dialogRef: MdDialogRef<FinishedRaportDialog>,
  ) {
    super(router, mdSnackBar);
  }

  ngOnInit(): void {
  }

  save() {
    this.location.back();
  }
}
