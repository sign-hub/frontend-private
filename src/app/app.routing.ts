import { Routes } from '@angular/router';

import { AuthenRouter } from './authen/authen.routing';
import { HomeRouter } from './home/home.routing';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  ...HomeRouter,
  ...AuthenRouter
];
