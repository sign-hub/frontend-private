import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StreamingToolComponent } from './_controller/streamingtool.component';
import { PlatformGuard } from 'app/login/_guard/platform.guard';

const routes: Routes = [
  {
    path: '', component: StreamingToolComponent,
    canActivate: [PlatformGuard],
    canActivateChild: [PlatformGuard],
    children: [
      {
        path: '',
        redirectTo: 'viewstreams',
        pathMatch: 'full'
      },
      {
        path: 'viewstreams',
        loadChildren: 'app/streamingtool/media/media.module#MediaModule'
      },
      {
        path: 'viewvideo/:id',
        loadChildren: 'app/streamingtool/view/view.module#ViewModule'
      }
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamingToolRouting { }