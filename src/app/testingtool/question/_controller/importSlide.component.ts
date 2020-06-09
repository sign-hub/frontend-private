import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';
import { QuestionService } from '../_services/question.service';
import { Question, TransitionType } from '../../../models/question';
import { Test } from '../../../models/test';
import { Transition } from '../../../models/transition';

@Component({
  selector: 'app-config-question-dialog',
  templateUrl: '../_views/importSlide.component.html',
  styleUrls: ['../_views/importSlide.component.scss', '../../../share/base.scss']
})
export class ImportSlideComponent extends BaseComponent implements OnInit {
  loadingUpdate: boolean;
  questionId: string;
  question: Test;
  isLoading: boolean;
  transition: Transition;
  questions: Array<any>;
  testlist: Array<any>;
  questionSelected: string;
  slideSelected: string;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<ImportSlideComponent>,
    private questionService: QuestionService,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
  }

  ngOnInit(): void {
    this.transition = new Transition();
    this.questions = new Array();
    this.questionId = this.data.questionId;
    this.question = this.data.question;
    this.questionSelected = null;
    this.loadTestList();
  }

  selectLevel(selected) {

  }

  initCheckboxOption() {

  }

  changeCheckbox(obj, value) {

  }

  loadTestList() {
    console.log('here');
    this.isLoading = true;
    this.questionService.getTestList().subscribe(res => {
      if (res.status === 'OK') {
        this.testlist = res.response;
        for (let i = 0; i < this.testlist.length; i++) {
          this.testlist[i].quests = new Array();
          for (const property in this.testlist[i].questions) {
            if (this.testlist[i].questions.hasOwnProperty(property)) {
              const q = {
                'id': property, 'name': this.testlist[i].questions[property],
                'selected': false
              };
              this.testlist[i].quests.push(q);
              this.questions[property] = q;
            }
          }
        }
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.isLoading = false;
    });
  }

  chooseQuestion(q) {
    for (let i = 0; i < this.testlist.length; i++) {
      for (let y = 0; y < this.testlist[i].quests.length; y++) {
        if (this.testlist[i].quests[y].id != q.id) {
          this.testlist[i].quests[y].selected = false;
        } else {
          if (this.testlist[i].quests[y].selected == false) {
            this.testlist[i].quests[y].selected = true;
            this.questionSelected = this.testlist[i].quests[y].id;
            this.selectQuestion(i, y);
          }
          else {
            this.testlist[i].quests[y].selected = false;
            this.questionSelected = null;
          }
          console.log(q);
        }
      }
    }
  }

  chooseSlide(s) {
    console.log('slide selected...');
    console.log(s);
    for (let i = 0; i < this.testlist.length; i++) {
      for (let y = 0; y < this.testlist[i].quests.length; y++) {
        if (this.testlist[i].quests[y].slides == undefined ||
          this.testlist[i].quests[y].slides == null)
          continue;
        for (let k = 0; k < this.testlist[i].quests[y].slides.length; k++) {
          if (this.testlist[i].quests[y].slides[k].slideId != s.slideId) {
            this.testlist[i].quests[y].slides[k].selected = false;
          } else {
            if (this.testlist[i].quests[y].slides[k].selected == false) {
              this.slideSelected = null;
            } else {
              this.slideSelected = this.testlist[i].quests[y].slides[k].slideId;
            }
          }
        }
      }
    }
  }

  collapse(e) {
    if (e.collapsed == true)
      e.collapsed = false;
    else
      e.collapsed = true;
  }

  selectQuestion(i, y) {
    if (this.questionSelected != null) {
      this.loadingUpdate = true;
      this.questionService.requestSlideList(this.questionSelected).subscribe(res => {
        if (res.status === 'OK') {
          console.log(res);
          this.testlist[i].quests[y].slides = res.response.slides;
          this.loadingUpdate = false;
          //this.dialogRef.close('OK');
          //this.openSnackBar('Updated test successful!');
        } else {
          console.log('Server Error');
          console.log(res);
          this.processStatusError(res.errors);
          this.loadingUpdate = false;
        }
      });
    }
  }


  importSlide() {
    console.log(this.slideSelected);
    if (this.slideSelected != null) {
      this.loadingUpdate = true;
      this.questionService.requestImportSlide(this.slideSelected, this.questionId).subscribe(res => {
        if (res.status === 'OK') {
          console.log(res);
          this.dialogRef.close('OK');
          this.openSnackBar('Updated test successful!');
          location.reload();
        } else {
          console.log('Server Error');
          console.log(res);
          this.processStatusError(res.errors);
        }
      });
    }

  }

}
