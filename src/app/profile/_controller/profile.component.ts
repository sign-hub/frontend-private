import { Component, OnInit } from '@angular/core';
import { ProfileSerivce } from '../_service/profile.service';
import { Profile } from '../_model/profile';
import { ProfileInfo } from '../_model/pofileInfo';
import { BaseComponent } from '../../share/base.component';
import { Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: '../_views/profile.component.html',
  styleUrls: ['../_views/profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  profile: Profile;
  profileInfo: ProfileInfo;
  profileInfoClone: ProfileInfo;
  loading: boolean;
  buttonLoading: boolean;

  constructor(private profileService: ProfileSerivce,
    protected router: Router,
    public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
    this.profileInfo = new ProfileInfo();
    this.profileInfoClone = new ProfileInfo();
    this.loading = false;
    this.buttonLoading = false;
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.loading = true;
    this.profileService.getUserCurrent().subscribe(res => {
      this.handleReponseUser(res, false);
      this.loading = false;
    });
  }

  updateUser() {
    this.buttonLoading = true;
    this.profileService.updateUser(this.profileInfoClone).subscribe(res => {
      this.handleReponseUser(res, true);
      this.buttonLoading = false;
    });
  }

  private handleReponseUser(res, isUpdate: boolean) {
    this.profile = res;
    if (this.profile.status === 'OK') {
      this.profileInfo = this.profile.response;
      this.profileInfoClone = Object.assign({}, this.profile.response);
      if (isUpdate) {
        this.openSnackBar('Update user info successful!');
      }
    } else {
      this.processStatusError(this.profile.errors);
      console.error('Server error');
    }
  }

}