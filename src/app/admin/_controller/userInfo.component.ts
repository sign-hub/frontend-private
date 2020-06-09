import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Select } from '../../share/_model/select';
import { User } from '../_model/user';
import { AdminService } from '../_service/admin.service';
import { BaseComponent } from '../../share/base.component';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-dialog-user-info',
  templateUrl: '../_views/userInfo.dialog.html',
  styleUrls: ['../_views/userInfo.dialog.scss', '../../share/base.scss']
})
export class UserInfoDialogComponent extends BaseComponent implements OnInit {
  user: User;
  roles: Array<Select>;
  loading: boolean;

  constructor(protected router: Router,
    protected mdSnackBar: MdSnackBar,
    private adminService: AdminService,
    public dialogRef: MdDialogRef<UserInfoDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
    if (this.data) {
      this.user = this.data;
      console.log(this.user);
    } else {
      this.user = new User();
    }
    this.initRole();
  }

  initRole() {
    this.roles = [];
    this.roles[0] = new Select('ADMIN', 'Platform Administrator');
    this.roles[1] = new Select('CON_PRO', 'Platform content provider');
    this.roles[2] = new Select('USER', 'Simple user ');
    this.roles[3] = new Select('AT_CON_PRO', 'Atlas content provider');
    this.roles[4] = new Select('TT_EDITOR', 'Testing tool editor');
    this.roles[5] = new Select('TT_USER', 'Testing tool user');
    this.roles[6] = new Select('GRAMMAR_ADMIN', 'Grammar tool administrator');
    this.roles[7] = new Select('GR_CON_PRO', 'Grammar tool content provider');
    this.roles[8] = new Select('AT_ADMIN', 'Atlas tool administrator');
    this.roles[9] = new Select('TT_ADMIN', 'Testing tool administrator');
    this.roles[10] = new Select('ST_ADMIN', 'Streaming tool administrator');
  }

  save() {
    this.loading = true;
    if (this.user.userId) {
      this.adminService.updateUser(this.user).subscribe(res => {
        if (res.status === 'OK') {
          this.openSnackBar('Updated user successful!');
          this.dialogRef.close('OK');
        } else {
          this.processStatusError(res.errors);
        }
        this.loading = false;
      });
    } else {
      this.adminService.saveUser(this.user).subscribe(res => {
        if (res.status === 'OK') {
          this.openSnackBar('Created user successful!');
          this.dialogRef.close('OK');
        } else {
          this.processStatusError(res.errors);
        }
        this.loading = false;
      });
    }
  }
}
