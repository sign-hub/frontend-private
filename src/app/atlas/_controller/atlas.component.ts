import {Component, OnInit } from '@angular/core';
import {Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationExtras} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MENUS} from '../../home/menu.const';
import {HomeService} from '../../home/_service/home.service';
import {ProfileSerivce} from '../../profile/_service/profile.service';
import {BaseComponent} from '../../share/base.component';
import {MdSnackBar} from '@angular/material';
import {MdDialog} from '@angular/material';
import {TestEventService} from '../../home/_service/testEvent.service';
import {TestSmall} from '../../testlist/_model/testSmall';


@Component({
  selector: 'app-home',
  templateUrl: '../_views/atlas.component.html',
  styleUrls: ['../_views/atlas.component.scss']
})
export class AtlasComponent extends BaseComponent implements OnInit {
  menus: any;
  user: any;

  constructor(public router: Router,
              private translate: TranslateService,
              private homeService: HomeService,
              private profileSerivce: ProfileSerivce,
              public dialog: MdDialog,
              private testEventService: TestEventService,
              public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
    this.menus = MENUS;

    router.events.subscribe( (event: Event) => {

        if (event instanceof NavigationEnd) {
          if (event.url != '/authen/login'){
            const url = event.url.split('?');
            localStorage.setItem('prevUrl', JSON.stringify({url : url[0] , params: this.router.routerState.root.snapshot.queryParams}));
          }
        }
    });
  }

  ngOnInit() {
    this.user = {};
    this.loadUserInfo();
    
  }

  logout() {
    this.homeService.requestLogout().subscribe(res => {
      localStorage.clear();
      if (res.status === 'OK') {
        this.router.navigate(['/authen/login']);
      } else {
        console.error('Server error');
      }
    });
  }

  loadUserInfo() {
    const userStr: string = localStorage.getItem('userInfo');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      this.profileSerivce.getUserCurrent().subscribe(res => {
        if (res.status === 'OK') {
          this.user = res.response;
          localStorage.setItem('userInfo', JSON.stringify(this.user));
        } else {
          this.processStatusError(res.errors);
          console.error('Server error');
        }
      });
    }
  }

  createTest() {

    this.requestCreateTest(null).subscribe(res => {
      if (res.status === 'OK') {
        this.testEventService.notify('OK');
        this.openSnackBar('Created test successful!');
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: res.response.TestId
          }
        };
        this.router.navigate(['/home/atlas/testedit'], navigationExtras);
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
    });
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  requestCreateTest(test: TestSmall) {
    const obj: any = {};
    obj.test = test;
    return this.homeService.requestPost('atlas/test', obj);
  }

}