import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Line } from '../_models/line';


declare var jQuery: any;

@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/clickarea.component.html',
  styleUrls: ['../_views/clickarea.component.scss', '../../../share/base.scss']
})
export class ClickareaComponent extends BaseComponent implements OnInit {

  input: any;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<ClickareaComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.input = this.data;
    this.input.name = this.data.groupName;
  }

  ngOnInit(): void {
  }




  async save() {
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

  changeNotToSave() {
    this.input.notToSave = !this.input.notToSave;
  }
}
