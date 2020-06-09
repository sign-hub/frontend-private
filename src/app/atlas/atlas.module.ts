import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AtlasRouting} from './atlas.routing';

import { AtlasComponent } from './_controller/atlas.component';

/*import { MediaModule } from './media/media.module';
import { ReportModule } from './report/report.module';*/
import { TestListModule } from './testlist/testlist.module';
import { TestEditModule } from './testedit/testEdit.module';
// ---------------------------
/*import { TestEditModule } from './testedit/testEdit.module';
import { TestPlayerModule } from './testPlayer/testPlayer.module';
import { QuestionModule } from './question/question.module';*/
// ---------------------------
import { SharedModule } from '../share/shared.module';



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
    AtlasRouting
    /*RouterModule.forChild(routes)*/
  ],
  declarations: [
    AtlasComponent
  ],
})

export class AtlasModule { }
