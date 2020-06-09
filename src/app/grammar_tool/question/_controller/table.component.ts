import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { STableComponent } from '../../../models/component';

@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/table.component.html',
  styleUrls: ['../_views/table.component.scss', '../../../share/base.scss']
})

export class TableComponent extends BaseComponent implements OnInit {
  input: any;
  new: STableComponent;
  labelRow: string;
  labelCol: string;

  constructor(public MatSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<TableComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, MatSnackBar);
    this.input = this.data;

    this.initNew();
  }

  initNew() {
    this.new = new STableComponent();
    this.labelRow = null;
    this.labelCol = null;
  }

  ngOnInit(): void {
    if (!this.input.tableComponent) {
      this.input.checkedString = '';
      this.input.tableComponent = [new Array<STableComponent>(), new Array<STableComponent>()];
    }
  }

  save() {
    if (this.input.groupName === undefined || this.input.groupName === null || this.input.groupName === '') {
      return;
    }
    const obj: any = {};
    obj.status = 'OK';
    obj.data = Object.assign({}, this.input);
    this.dialogRef.close(obj);
  }

  addNewLabel(n: number) {
    if (this.new !== undefined && this.new !== null) {
      const newComp = new STableComponent();
      newComp.label = n === 0 ? this.labelRow : this.labelCol;
      if (newComp.label)
        this.input.tableComponent[n].push(newComp);

      this.initNew();
    }
  }

  deleteTable(r: number, n: number) {
    this.input.tableComponent[r].splice(n, 1);
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

}
