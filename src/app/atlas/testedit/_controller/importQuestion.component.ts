import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';
import { TestEditService } from '../_services/testEdit.service';
import { Question, TransitionType } from '../../../models/question';
import { Test } from '../../../models/test';
import { Transition } from '../../../models/transition';

@Component({
  selector: 'app-config-question-dialog',
  templateUrl: '../_views/importQuestion.component.html',
  styleUrls: ['../_views/importQuestion.component.scss', '../../../share/base.scss']
})
export class ImportQuestionComponent extends BaseComponent implements OnInit {
  loadingUpdate: boolean;
  testId: string;
  test: Test;
  isLoading: boolean;
  transition: Transition;
  questions: Array<any>;
  testlist: Array<any>;
  questionSelected: Array<string>;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<ImportQuestionComponent>,
    private testEditService: TestEditService,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
  }

  ngOnInit(): void {
    this.transition = new Transition();
    this.questions = new Array();
    this.testId = this.data.testId;
    this.test = this.data.test;
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
    this.testEditService.getTestList().subscribe(res => {
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
    // for(let i=0; i<this.testlist.length; i++){
    //   for(let y=0; y<this.testlist[i].quests.length; y++){
    //     if(this.testlist[i].quests[y].id == q.id){
    //         console.log(q);
    //         console.log(this.testlist[i].quests[y].selected);
    //       // if(!q.selected){
    //       //   q.selected = true;
    //       //   this.testlist[i].quests[y].selected = true;
    //       // }else{
    //       //   q.selected = false;
    //       //   this.testlist[i].quests[y].selected = false;
    //       // }
    //     }
    //   }
    // }
  }

  collapse(e) {
    if (e.collapsed == true)
      e.collapsed = false;
    else
      e.collapsed = true;
  }

  importQuestion() {
    console.log(this.testlist);
    for (let i = 0; i < this.testlist.length; i++) {
      for (let y = 0; y < this.testlist[i].quests.length; y++) {
        console.log(this.testlist[i].quests[y]);
        if (this.testlist[i].quests[y].selected) {
          if (this.testlist[i].quests[y] != null) {
            this.loadingUpdate = true;
            this.testEditService.requestImportQuestion(this.testlist[i].quests[y].id, this.testId).subscribe(res => {
              if (res.status === 'OK') {
                console.log(res);
                this.dialogRef.close('OK');
                this.openSnackBar('Updated test successful!');
              } else {
                console.log('Server Error');
                console.log(res);
                this.processStatusError(res.errors);
              }
            });
          }
        }
      }
    }
  }

}
