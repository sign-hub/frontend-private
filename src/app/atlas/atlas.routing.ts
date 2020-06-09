import { AuthenGuard } from './../login/_guard/authen.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtlasComponent } from './_controller/atlas.component';
import { PlatformGuard } from '../login/_guard/platform.guard';


const routes: Routes = [
  {
    path: '', component: AtlasComponent,
    canActivate: [PlatformGuard],
    canActivateChild: [PlatformGuard],
    children: [
      {
        path: '',
        redirectTo: 'testlist',
        pathMatch: 'full'
      },
      {
        path: 'testlist',
        loadChildren: './testlist/testlist.module#TestListModule'
      },
      {
        path: 'report',
        loadChildren: 'app/atlas/report/report.module#ReportModule'
      },
      {
        path: 'media',
        loadChildren: 'app/atlas/media/media.module#MediaModule'
      },
      {
        path: 'testedit',
        loadChildren: 'app/atlas/testedit/testEdit.module#TestEditModule'
      },
      {
        path: 'testplayer',
        loadChildren: 'app/atlas/testPlayer/testPlayer.module#TestPlayerModule'
      },
      {
        path: 'section',
        loadChildren: 'app/atlas/question/question.module#QuestionModule'
      },
      {
        path: 'uploadedmedias',
        loadChildren: 'app/atlas/uploadedmedias/uploadedmedias.module#UploadedMediasModule'
      },
      {
        path: 'management',
        loadChildren: 'app/atlas/management/management.module#ManagementModule'
      },
      {
        path: 'reportdownload/:id',
        loadChildren: 'app/atlas/reportdownload/reportdownload.module#ReportdownloadModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtlasRouting { }
