import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadedMediasComponent } from './_controller/uploadedmedias.component';

const routes: Routes = [
  { path: '', component: UploadedMediasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadedMediasRouting { }