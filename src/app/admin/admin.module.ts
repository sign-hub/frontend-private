import {NgModule} from '@angular/core';

import {AdminComponent} from './_controller/admin.component';
import {AdminRouting} from './admin.routing';
import {SharedModule} from '../share/shared.module';
import {AdminService} from './_service/admin.service';
import {UserInfoDialogComponent} from './_controller/userInfo.component';
import {DeleteUserComponent} from './_controller/delUser.component';

@NgModule({
  imports: [
    AdminRouting,
    SharedModule
  ],
  declarations: [AdminComponent, UserInfoDialogComponent, DeleteUserComponent],
  exports: [],
  providers: [AdminService],
  entryComponents: [UserInfoDialogComponent, DeleteUserComponent]
})
export class AdminModule {
}
