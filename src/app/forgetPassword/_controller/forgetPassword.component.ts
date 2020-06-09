import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Forget } from '../_model/forget';
import { ForgetService } from '../_services/forget.service';


@Component({
  selector: 'app-forgetpassword',
  templateUrl: '../_views/forgetpassword.component.html',
  styleUrls: ['../_views/forgetpassword.component.scss', '../../share/base.scss']
})
export class ForgetPasswordComponent {
  buttonLoading: boolean;
  forget: Forget;
  constructor(private router: Router, private forgetService: ForgetService,
    private route: ActivatedRoute) {
    this.forget = new Forget();
    this.route.queryParams.subscribe(params => {
      this.forget.login = params.email;
    });
  }

  sendPassword() {

    this.forgetService.requestForget(this.forget).subscribe(res => {
      if (res.status === 'OK') {
        this.router.navigate(['/authen/login']);
      }
    }, err => {
      console.log('Server Error');
    });
  }

}
