import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestingToolRouting } from './testingtool.routing';

import { TestingToolComponent } from './_controller/testingtool.component';

/*import { MediaModule } from './media/media.module';
import { ReportModule } from './report/report.module';*/
import { TestListModule } from './testlist/testlist.module';
// ---------------------------
/*import { TestEditModule } from './testedit/testEdit.module';
import { TestPlayerModule } from './testPlayer/testPlayer.module';
import { QuestionModule } from './question/question.module';*/
// ---------------------------

import { SharedModule } from '../share/shared.module';
import { DialogHyperlinkComponent } from 'app/grammar_tool/dialogHyperlink/_controller/dialog-hyperlink.component';



@NgModule({
  imports: [

    /*TestEditModule,
    TestPlayerModule,
    QuestionModule,

    ReportModule,*/
    //TestListModule,
    //MediaModule,
    CommonModule,
    SharedModule,
    TestingToolRouting
    /*RouterModule.forChild(routes)*/
  ],
  declarations: [
    TestingToolComponent
  ]
})

export class TestingToolModule { }
