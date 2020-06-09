import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { TestEditService } from '../_services/testEdit.service';
import { Test, TestStatus } from '../../../models/test';
import { TestEditDialogComponent } from './testEditDialog.component';
import { ConfigQuestionComponent } from './configQuestion.component';
import { DeleteQuestionComponent } from './delQuestion.component';
import { DiscardChangesComponent } from './discardChanges.component';
import { ConfigContentProviders } from './configContentProviders.component';
import { Question } from '../../../models/question';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-test-editor',
  templateUrl: '../_views/testEdit.component.html',
  styleUrls: ['../_views/testEdit.component.scss', '../../../share/e-home.scss']
})
export class TestEditComponent extends BaseComponent implements OnInit, OnDestroy {
  heightTestEdit: string;
  hieghtTestEdit: string;
  test: Test;
  isLoading: boolean;
  questionLoading: boolean;
  options: Array<string>;
  date: string;
  draggIndex: string;
  sortChanged = false;
  forceDiscard = false;
  private _unsubscribeAll: Subject<any>;

  constructor(protected router: Router,
    public mdSnackBar: MdSnackBar,
    private route: ActivatedRoute,
    private testEditService: TestEditService,
    public dialog: MdDialog) {
    super(router, mdSnackBar);
    this.heightTestEdit = (this.height - 100) + 'px';
    this.hieghtTestEdit = (this.height - 100) + 'px';
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init();
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  init() {
    this.test = new Test();
    this.isLoading = true;
    this.route.queryParams
      .takeUntil(this._unsubscribeAll)
      .subscribe(params => {
        if (params == undefined || params == null ||
          params.id == undefined || params.id == null || params.id == '') {
          const navigationExtras: NavigationExtras = {
          };
          this.router.navigate(['/home/atlas/testlist'], navigationExtras);
          return;
        }
        this.testEditService.requetGetTest(params.id)
          .takeUntil(this._unsubscribeAll)
          .subscribe(res => {
            if (res.status === 'OK') {
              this.test = res.response;
              this.getDate();
              this.initOptions();
              if (this.test.state === TestStatus.NEW) {
                this.openDialogEditTest();
              }
            } else {
              console.error('Server error');
              this.processStatusError(res.errors);
            }
            this.isLoading = false;
          });
      });
  }

  getDate() {
    const rev = this.test.revId.split('_');
    const timeArr = rev[3].split(':');
    const time = [timeArr[0], timeArr[1]].join(':');
    this.date = rev[2] + '/' + rev[1] + '/' + rev[0] + ' ' + time;
  }
  initOptions() {
    this.options = [];
    for (const i in this.test.options) {
      let str = '';
      if (this.test.options[i] === 'true') {
        if (i === 'suspendable') {
          str = 'Test can be suspended ';
        } else if (i === 'partial') {
          str = 'Test can record partial results';
        } else if (i === 'randomized') {
          str = 'Test have randomized questions';
        } else if (i === 'changeable') {
          str = 'User can change already answered questions';
        } else if (i === 'public') {
          str = 'The test is public';
        } else {
          str = '';
        }
        this.options.push(str);
      }
    }
  }

  openDialogEditTest() {
    const data: any = Object.assign({}, this.test);
    const dialogEditTest = this.dialog.open(TestEditDialogComponent, { disableClose: true, data: data });
    dialogEditTest.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res === 'OK') {
          this.init();
        }
      });
  }

  newQuestion() {
    this.questionLoading = true;
    this.testEditService.requestNewQuestion(this.test.TestId)
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          this.testEditService.requestQuestionList(this.test.TestId)
            .takeUntil(this._unsubscribeAll)
            .subscribe(res => {
              if (res.status === 'OK') {
                this.test.questions = res.response;
              } else {
                this.processStatusError(res.errors);
                console.error('Server error');
              }
              this.questionLoading = false;
            });
        } else {
          this.processStatusError(res.errors);
          console.error('Server error');
          this.questionLoading = false;
        }
      });
  }

  editQuestion(obj) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: obj.questionId
      }
    };
    this.router.navigate(['/home/atlas/section'], navigationExtras);
  }

  private bindingQuestion(question) {
    if (this.test.questions) {
      for (let i = 0; i < this.test.questions.length; i++) {
        if (this.test.questions[i].questionId === question.questionId) {
          this.test.questions[i] = question;
        }
      }
    }
  }

  openTestPreview() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.test.TestId,
        preview: true
      }
    };
    this.router.navigate(['/home/atlas/testplayer'], navigationExtras);
  }

  openTestView() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.test.TestId,
        preview: false
      }
    };
    if (this.test['reportId']) {
      navigationExtras = {
        queryParams: {
          id: this.test.TestId,
          preview: false,
          report_id: this.test['reportId']
        }
      };
    }
    this.router.navigate(['/home/atlas/testplayer'], navigationExtras);
  }

  configQuestion(question) {
    const obj: any = {};
    if (question.options === undefined || question.options === null) {
      question.options = [];
    }
    obj.question = question;
    obj.testId = this.test.TestId;
    const dialogRef = this.dialog.open(ConfigQuestionComponent, { disableClose: true, data: obj });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        this.bindingQuestion(res);
      });
  }

  deleteQuestion(question) {
    const d = this.dialog.open(DeleteQuestionComponent, { disableClose: true, data: question });
    d.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res === 'OK') {
          this.init();
        }
      });
  }

  saveQuestionOrder() {
    console.log(this.test.questions);
    const orders = {};
    orders['testId'] = this.test.TestId;
    orders['questions'] = new Array();
    for (let i = 0; i < this.test.questions.length; i++) {
      const question = this.test.questions[i];
      orders['questions'].push({
        'question': question.questionId,
        'order': i
      });
    }
    this.testEditService.orderQuestions(orders)
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        this.sortChanged = false;
        this.openSnackBar('Order Updated');
        console.log(res);
      });
    console.log(orders);
  }
  draggedSuccess(i) {
    if (this.draggIndex != i) {
      this.sortChanged = true;
    }
  }
  draggedStart(i) {
    this.draggIndex = i;
  }

  canDeactivate() {

    if (!this.sortChanged || this.forceDiscard) {
      return true;
    }

    return this.openDiscardChangesDialog();
  }

  openDiscardChangesDialog() {
    const data: any = Object.assign({}, null);
    const dialogDiscardChanges = this.dialog.open(DiscardChangesComponent, { data: data });
    dialogDiscardChanges.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        this.forceDiscard = true;
        console.log(this.forceDiscard);
      });
  }

  previewQuestion(test: any, index) {
    console.log(index);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.test.TestId,
        index: index,
        preview: true
      }
    };
    this.router.navigate(['/home/atlas/testplayer'], navigationExtras);
  }

  editSettings() {
    const obj: any = {};
    const dialogRef = this.dialog.open(ConfigContentProviders, { disableClose: true, data: this.test });
    dialogRef.afterClosed()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {

      });
  }
}
