import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestingToolComponent } from './_controller/testingtool.component';
import { PlatformGuard } from 'app/login/_guard/platform.guard';

const routes: Routes = [
  {
    path: '', component: TestingToolComponent,
    canActivate: [PlatformGuard],
    canActivateChild: [PlatformGuard],
    children: [
      {
        path: '',
        redirectTo: 'testlist',
        pathMatch: 'full'
      },
      {
        path: 'report',
        loadChildren: 'app/testingtool/report/report.module#ReportModule'
      },
      {
        path: 'testlist',
        loadChildren: 'app/testingtool/testlist/testlist.module#TestListModule'
      },
      {
        path: 'media',
        loadChildren: 'app/testingtool/media/media.module#MediaModule'
      },
      {
        path: 'testedit',
        loadChildren: 'app/testingtool/testedit/testEdit.module#TestEditModule'
      },
      {
        path: 'testplayer',
        loadChildren: 'app/testingtool/testPlayer/testPlayer.module#TestPlayerModule'
      },
      {
        path: 'question',
        loadChildren: 'app/testingtool/question/question.module#QuestionModule'
      },
      {
        path: 'reportdownload/:id',
        loadChildren: 'app/testingtool/reportdownload/reportdownload.module#ReportdownloadModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestingToolRouting { }