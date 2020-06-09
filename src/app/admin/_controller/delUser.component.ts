import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {BaseComponent} from '../../share/base.component';
import {User} from '../_model/user';
import {AdminService} from '../_service/admin.service';

@Component({
  selector: 'app-dialog-del-user',
  templateUrl: '../_views/delUser.component.html',
  styleUrls: ['../_views/delUser.component.scss']
})
export class DeleteUserComponent extends BaseComponent implements OnInit{
  buttonSubmitState: boolean;
  user: User;
  loading: boolean;
  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              private adminService: AdminService,
              public dialogRef: MdDialogRef<DeleteUserComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
  }

  ngOnInit(): void {
    this.user = this.data;
  }
  deleteUser() {
    this.loading = true;
    this.adminService.deleteUser(this.user.userId).subscribe(res => {
      if (res.status === 'OK') {
        this.openSnackBar('Delete user successful!');
        this.dialogRef.close('OK');
      } else {
        this.processStatusError(res.errors);
      }
      this.loading = false;
    });
  }
}
