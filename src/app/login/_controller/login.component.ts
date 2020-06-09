import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthenService } from '../_service/authen.service';
import { Login } from '../_model/login';
import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { ProfileSerivce } from '../../profile/_service/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: '../_views/login.component.html',
  styleUrls: ['../_views/login.component.scss', '../../share/base.scss']
})
export class LoginComponent implements OnInit {
  buttonLoading: boolean;
  authen: Login;
  isError: boolean;
  constructor(private router: Router,
    private authenService: AuthenService, protected http: Http, private profileService: ProfileSerivce) {
  }

  ngOnInit() {
    this.authen = new Login();
    this.isError = false;
  }

  doLogin() {
    this.buttonLoading = true;
    this.authenService.login(this.authen).subscribe(res => {
      if (res.status === 'OK') {
        this.buttonLoading = false;
        localStorage.setItem('token', res.response.authToken);
        localStorage.setItem('userId', res.response.userId);

        const prevUrl = JSON.parse(localStorage.getItem('prevUrl'));

        if (!!prevUrl) {
          this.profileService.getUserCurrent().subscribe(res => {
            localStorage.setItem('userInfo', JSON.stringify(res.response));
            if (res.response.role == 'AT_CON_PRO') {
              this.router.navigate(['/home/atlas']);
            } else if (res.response.role == 'TT_EDITOR' || res.response.role == 'TT_USER') {
              this.router.navigate(['/home/testingtool']);
            } else {
              const navigationExtras: NavigationExtras = {
                queryParams: prevUrl.params
              };
              localStorage.removeItem('prevUrl');
              this.router.navigate([prevUrl.url], navigationExtras);
            }
          });
        } else {
          this.profileService.getUserCurrent().subscribe(res => {
            localStorage.setItem('userInfo', JSON.stringify(res.response));
            if (res.response.role == 'AT_CON_PRO') {
              this.router.navigate(['/home/atlas']);
            } else if (res.response.role == 'TT_EDITOR' || res.response.role == 'TT_USER') {
              this.router.navigate(['/home/testingtool']);
            } else {
              this.router.navigate(['/home/profile']);
            }
          });


        }

      } else {
        this.buttonLoading = false;
        localStorage.clear();
        this.isError = true;
        this.authen.password = null;
        setTimeout(() => {
          this.isError = false;
        }, 3000);
      }
    });
  }

  forgetPassword() {
    this.router.navigate(['/authen/recoverypassword']);
  }

}
