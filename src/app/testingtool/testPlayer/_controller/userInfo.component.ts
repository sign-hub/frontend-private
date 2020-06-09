import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';


@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/userInfo.component.html',
  styleUrls: ['../_views/userInfo.component.scss', '../../../share/base.scss']
})
export class UserInfoComponent extends BaseComponent implements OnInit {
  input: any;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<UserInfoComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.input = this.data;
  }

  ngOnInit(): void {
  }

  save() {
    if (this.isNil('name') || this.isNil('surname') ||
      this.isNil('age') || this.isNil('gender')) {
      return;
    }
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  isNil(field): boolean {
    if (field === undefined || field === null) {
      return true;
    }
    if (this.input[field] === undefined || this.input[field] === null) {
      return true;
    }
    if (typeof this.input[field] === 'string') {
      if (this.input[field].trim() === '') {
        return true;
      }
    }
    return false;
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

}
