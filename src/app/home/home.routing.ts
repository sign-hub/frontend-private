import { Route } from '@angular/router';
import { HomeComponent } from './_controller/home.component';
import { AuthenGuard } from '../login/_guard/authen.guard';
import { AtlasGuard } from '../login/_guard/atlas.guard';
import { TestingToolGuard } from 'app/login/_guard/testingtool.guard';

export const HomeRouter: Route[] = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenGuard],
    canActivateChild: [AuthenGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        loadChildren: 'app/profile/profile.module#ProfileModule'
      },
      {
        path: 'admin',
        loadChildren: 'app/admin/admin.module#AdminModule',
        canActivate: [TestingToolGuard]
      },
      {
        path: 'contacts',
        loadChildren: 'app/contacts/contacts.module#ContactsModule',
        canActivate: [TestingToolGuard]
      },
      {
        path: 'report',
        loadChildren: 'app/report/report.module#ReportModule',
        canActivate: [TestingToolGuard]
      },
      {
        path: 'testlist',
        loadChildren: 'app/testlist/testlist.module#TestListModule'
      },
      {
        path: 'media',
        loadChildren: 'app/media/media.module#MediaModule',
        canActivate: [TestingToolGuard]
      },
      {
        path: 'testedit',
        loadChildren: 'app/testedit/testEdit.module#TestEditModule',
      },
      {
        path: 'testplayer',
        loadChildren: 'app/testPlayer/testPlayer.module#TestPlayerModule'
      },
      {
        path: 'question',
        loadChildren: 'app/question/question.module#QuestionModule',
        canActivate: [TestingToolGuard]
      },
      // -----------------------------
      // MODULI DUPLICATI IN ATLAS
      // -----------------------------
      /*{
        path: 'admin',
        loadChildren: 'app/admin/admin.module#AdminModule'
      },
      {
        path: 'report',
        loadChildren: 'app/report/report.module#ReportModule'
      },
      {
        path: 'testlist',
        loadChildren: 'app/testlist/testlist.module#TestListModule'
      },
      {
        path: 'media',
        loadChildren: 'app/media/media.module#MediaModule'
      },*/
      // -----------------------------
      // FINE
      // -----------------------------
      {
        path: 'atlas',
        loadChildren: 'app/atlas/atlas.module#AtlasModule',
        canActivate: [TestingToolGuard]
      },
      {
        path: 'testingtool',
        loadChildren: 'app/testingtool/testingtool.module#TestingToolModule'
      },
      {
        path: 'grammar_tool',
        loadChildren: 'app/grammar_tool/grammar_tool.module#GrammarToolModule',
        canActivate: [TestingToolGuard]
      },
      {
        path: 'streaming_tool',
        loadChildren: 'app/streamingtool/streamingtool.module#StreamingToolModule',
        canActivate: [TestingToolGuard]
      }
    ]
  }
];
