import { Component, Inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { Router } from '@angular/router';
import { MD_DIALOG_DATA, MdSnackBar, MdDialogRef, MdDialog } from '@angular/material';
import { Test, TestStatus } from '../../../models/test';
import { TestEditService } from '../_services/testEdit.service';
import { TestEventService } from '../../../home/_service/testEvent.service';
import { ImportQuestionComponent } from './importQuestion.component';
import { IMyDpOptions } from 'ng4-datepicker';

@Component({
  selector: 'app-test-editor-dialog',
  templateUrl: '../_views/testEditDialog.component.html',
  styleUrls: ['../_views/testEditDialog.component.scss', '../../../share/e-home.scss']
})
export class TestEditDialogComponent extends BaseComponent implements OnInit {
  test: Test;
  loading: boolean;
  options: Array<any>;
  loadingUpdate: boolean;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
  };

  startSubmisssionInterval;
  endSubmisssionInterval;

  constructor(protected router: Router,
    public mdSnackBar: MdSnackBar,
    private testEditService: TestEditService,
    public dialogRef: MdDialogRef<TestEditDialogComponent>,
    public dialog: MdDialog,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.test = this.data;
  }

  ngOnInit(): void {
    this.initOptions();
    this._checkOption();
  }

  initOptions() {
    this.options = [];
    this.options.push({ value: false, field: 'suspendable', name: 'Test can be suspended ' });
    this.options.push({ value: false, field: 'partial', name: 'Test can record partial results ' });
    //this.options.push({value: false, field: 'randomized', name: 'Test have randomized questions'});
    this.options.push({ value: false, field: 'changeable', name: 'User can change already answered questions' });
    this.options.push({ value: false, field: 'public', name: 'The test is public' });

    if (!!this.test.options.startSubmisssionInterval) {
      this.startSubmisssionInterval = this.formatDateToObject(this.test.options.startSubmisssionInterval);
    }
    if (!!this.test.options.endSubmisssionInterval) {
      this.endSubmisssionInterval = this.formatDateToObject(this.test.options.endSubmisssionInterval);
    }
  }

  changeOption(o) {
    o.value = !o.value;
  }

  private _checkOption() {
    for (const k in this.test.options) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].field === k) {
          this.options[i].value = true;
        }
      }
    }
  }

  private _getOptions() {
    const ops = {};
    for (let i = 0; i < this.options.length; i++) {
      const o: any = this.options[i];
      if (this.options[i].value) {
        ops[o.field] = o.value.toString();
      } else {
        ops[o.field] = null;
      }
    }
    if (!!this.startSubmisssionInterval) {
      if (!this.startSubmisssionInterval.formatted) {

        if (this.startSubmisssionInterval.date.day.length == 1) {
          this.startSubmisssionInterval.date.day = '0' + this.startSubmisssionInterval.date.day;
        }

        this.startSubmisssionInterval.formatted = this.startSubmisssionInterval.date.day + '/' + this.startSubmisssionInterval.date.month + '/' + this.startSubmisssionInterval.date.year;
      }
      ops['startSubmisssionInterval'] = this.formatDateToBackendDate(this.startSubmisssionInterval.formatted);
    } else {
      ops['startSubmisssionInterval'] = '';
    }

    if (!!this.endSubmisssionInterval) {
      if (!this.endSubmisssionInterval.formatted) {

        if (this.endSubmisssionInterval.date.day.length == 1) {
          this.endSubmisssionInterval.date.day = '0' + this.endSubmisssionInterval.date.day;
        }

        this.endSubmisssionInterval.formatted = this.endSubmisssionInterval.date.day + '/' + this.endSubmisssionInterval.date.month + '/' + this.endSubmisssionInterval.date.year;
      }
      ops['endSubmisssionInterval'] = this.formatDateToBackendDate(this.endSubmisssionInterval.formatted);
    } else {
      ops['endSubmisssionInterval'] = '';
    }

    return ops;
  }

  formatDateToObject(formatedDate) {
    const splited = formatedDate.split('');

    const year = splited[0] + splited[1] + splited[2] + splited[3];
    const month = splited[4] + splited[5];

    if (splited[6] == '0') {
      var day = splited[7];
    } else {
      var day = splited[6] + splited[7];
    }

    return { date: { year: year, month: month, day: day } };
  }

  formatDateToBackendDate(formatedDate) {
    const splited = formatedDate.split('/');
    return splited[2] + splited[1] + splited[0];
  }

  publishTest() {
    this.loading = true;
    this.testEditService.requestPublishTest(this.test.TestId).subscribe(res => {
      if (res.status === 'OK') {
        this.test = res.response;
        this.dialogRef.close('OK');
        this.openSnackBar('Publish test successful!');
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.loading = false;
    });
  }

  updateTest() {
    this.loadingUpdate = true;
    this.test.options = this._getOptions();
    this.test.questions = [];
    if (this.test.state === TestStatus.NEW) {
      this.test.state = TestStatus.DRAFT;
    }
    this.testEditService.requestUpdateTest(this.test).subscribe(res => {
      if (res.status === 'OK') {
        this.test = res.response;
        this.dialogRef.close('OK');
        this.openSnackBar('Updated test successful!');
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.loadingUpdate = false;
    });
  }

  importQuestion() {
    console.log('import question');
    const obj: any = {};
    obj.test = this.test;
    obj.testId = this.test.TestId;
    const dialogRef = this.dialog.open(ImportQuestionComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed().subscribe(res => {
      //this.bindingQuestion(res);
      console.log(res);
    });
  }

}
