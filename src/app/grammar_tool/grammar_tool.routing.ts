import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrammarToolComponent } from './_controller/grammar_tool.component';
import { PlatformGuard } from 'app/login/_guard/platform.guard';

const routes: Routes = [
  { path: '', component: GrammarToolComponent,
  children: [
    {
      path: '',
      // redirectTo: 'testlist',
      pathMatch: 'full',
      canActivate: [PlatformGuard],
      canActivateChild: [PlatformGuard],
    },
    {
      path: 'grammarlist',
      loadChildren: 'app/grammar_tool/testlist/testlist.module#TestListModule'
    },
    {
      path: 'report',
      loadChildren: 'app/grammar_tool/report/report.module#ReportModule'
    },
    {
      path: 'media',
      loadChildren: 'app/grammar_tool/media/media.module#MediaModule'
    },
    {
      path: 'grammaredit',
      loadChildren: 'app/grammar_tool/testedit/testEdit.module#TestEditModule'
    },
    {
      path: 'grammarview',
      loadChildren: 'app/grammar_tool/testPlayer/testPlayer.module#TestPlayerModule'
    },
    // {
    //   path: 'section',
    //   loadChildren: 'app/grammar_tool/question/question.module#QuestionModule'
    // },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrammarToolRouting { }