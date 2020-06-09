import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../share/base.component';
import { Router } from '@angular/router';
import { MdSnackBar, MdDialog } from '@angular/material';
import { AdminService } from '../_service/admin.service';
import { UserInfoDialogComponent } from './userInfo.component';
import { Select } from '../../share/_model/select';
import { User } from '../_model/user';
import { DeleteUserComponent } from './delUser.component';
import { Search } from '../_model/search';


@Component({
  selector: 'app-admin',
  templateUrl: '../_views/admin.component.html',
  styleUrls: ['../_views/admin.component.scss', '../../share/e-home.scss']
})
export class AdminComponent extends BaseComponent implements OnInit {
  heightAdmin: string;
  roles: Array<Select>;
  isLoading: boolean;
  users: Array<User>;
  userIndex: number;
  user: User;
  isDeleted: boolean;
  search: Search;

  constructor(protected router: Router,
    protected mdSnackBar: MdSnackBar,
    private adminService: AdminService,
    public dialog: MdDialog) {
    super(router, mdSnackBar);
    this.heightAdmin = (this.height - 100) + 'px';
    this.userIndex = -1;

    if (JSON.parse(localStorage.getItem('userInfo')).role != 'ADMIN') {
      this.router.navigate(['home/profile']);
    }


  }

  ngOnInit() {
    this.isLoading = false;
    this.search = new Search();
    this.initRole();
    this.loadListUser(null, null, null);
  }

  initRole() {
    this.roles = [];
    this.roles[0] = new Select('ADMIN', 'Platform Administrator');
    this.roles[1] = new Select('CON_PRO', 'Platform content provider');
    this.roles[2] = new Select('USER', 'Simple user');
    this.roles[3] = new Select('AT_CON_PRO', 'Atlas content provider');
    this.roles[4] = new Select('TT_EDITOR', 'Testing tool editor');
    this.roles[5] = new Select('TT_USER', 'Testing tool user');
    this.roles[6] = new Select('GRAMMAR_ADMIN', 'Grammar tool administrator');
    this.roles[7] = new Select('GR_CON_PRO', 'Grammar tool content provider');
    this.roles[8] = new Select('AT_ADMIN', 'Atlas tool administrator');
    this.roles[9] = new Select('TT_ADMIN', 'Testing tool administrator');
    this.roles[10] = new Select('ST_ADMIN', 'Streaming tool administrator');
  }


  loadListUser(role: string, email: string, name: string) {
    this.isLoading = true;
    this.adminService.getUsers(role, email, name).subscribe(res => {
      if (res.status === 'OK') {
        this.users = res.response;
        if (this.users.length > 0) {
          this.userIndex = 0;
          this.user = this.users[0];
        }
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.isLoading = false;
    });
  }

  chooseUser(index, user) {
    this.userIndex = index;
    this.user = user;
    if (this.user.deleted) {
      this.isDeleted = true;
    } else {
      this.isDeleted = false;
    }
  }

  openDialogUserInfo() {
    const dialogRef = this.dialog.open(UserInfoDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'OK') {
        this.loadListUser(null, null, null);
      }
    });
  }

  openDialogUpdateEdit() {
    if (this.user.userId) {
      const dialogUpdate = this.dialog.open(UserInfoDialogComponent, { disableClose: true, data: this.user });
      dialogUpdate.afterClosed().subscribe(res => {
        if (res === 'OK') {
          this.loadListUser(null, null, null);
        }
      });
    }
  }

  openDialogDelUser() {
    if (this.user.userId) {
      const dialogDelete = this.dialog.open(DeleteUserComponent, { disableClose: true, data: this.user });
      dialogDelete.afterClosed().subscribe(res => {
        if (res === 'OK') {
          this.loadListUser(null, null, null);
        }
      });
    }
  }

  filterListUser() {
    this.loadListUser(this.search.role, this.search.email, this.search.name);
  }
}
