import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TestEditComponent} from './_controller/testEdit.component';

const routes: Routes = [
  {path: '', component: TestEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestEditRouting {
}
