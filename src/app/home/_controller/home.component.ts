import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MENUS } from '../menu.const';
import { HomeService } from '../_service/home.service';
import { ProfileSerivce } from '../../profile/_service/profile.service';
import { BaseComponent } from '../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { MdDialog } from '@angular/material';
import { TestEventService } from '../_service/testEvent.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: '../_views/home.component.html',
  styleUrls: ['../_views/home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
  menus: any;
  user: any;
  selectedMenu: string;
  selectedLanguage = 'en';
  private _unsubscribeAll: Subject<any>;
  userInfo: any;

  constructor(public router: Router,
    private translate: TranslateService,
    private homeService: HomeService,
    private profileSerivce: ProfileSerivce,
    public dialog: MdDialog,
    private testEventService: TestEventService,
    public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
    this._unsubscribeAll = new Subject();
    this.menus = MENUS;
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ngOnInit() {
    this.user = {};
    this.loadUserInfo();
    const url = this.router.url;
    const comp = url.split('/');

    if (comp.length > 2) {
      switch (comp[2]) {
        case 'atlas':
          this.changeMenu('MenuAtlas');
          break;
        case 'testingtool':
          this.changeMenu('MenuTesting');
          break;
        case 'grammar_tool':
          this.changeMenu('MenuGrammarTool');
          break;
        default:
          this.changeMenu('MenuStart');
          break;
      }
    }

  }

  goHome() {
    this.selectedMenu = 'Menu1';
    this.router.navigate(['/home']).then(nav => {
    }, err => {
      alert(err.message); // when there's an error
    });
  }

  changeMenu(cMenu) {
    console.log(cMenu);
    this.selectedMenu = cMenu;
  }

  logout() {
    this.homeService.requestLogout()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userInfo');

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
      if (this.user['role'] == 'AT_CON_PRO') {
        this.changeMenu('MenuAtlas');
      }
    } else {
      this.profileSerivce.getUserCurrent()
        .takeUntil(this._unsubscribeAll)
        .subscribe(res => {
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

  get isUser() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if(userInfo == undefined || userInfo == null)
      return false;
    return userInfo.role == 'TT_USER'
  }

  get isUserEditor() {
    
    if (localStorage.getItem('userInfo')) {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if(userInfo == undefined || userInfo == null)
          return false;
      return userInfo.role == 'TT_USER' || userInfo.role == 'TT_EDITOR'
    } else {
      return false;
    }

  }

  canAdmin() {
    if(this.userInfo != null) {
      return this.userInfo.role == 'ADMIN'
    }
    else {
      if (localStorage.getItem('userInfo')) {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if(this.userInfo == undefined || this.userInfo == null)
            return false;
        return this.userInfo.role == 'ADMIN'
      } else {
        return false;
      }
    }
  }

  check(role, arr: Array<string>) {
    return arr.includes(role);
  }

  canTesting() {
    if(this.userInfo != null) {
      return this.check(this.userInfo.role, ['TT_USER', 'TT_EDITOR', 'TT_ADMIN', 'ADMIN']);
    }
    else {
      if (localStorage.getItem('userInfo')) {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if(this.userInfo == undefined || this.userInfo == null)
            return false;
        return this.check(this.userInfo.role, ['TT_USER', 'TT_EDITOR', 'TT_ADMIN', 'ADMIN']);
      } else {
        return false;
      }
    }
  }

  canAtlas() {
    if(this.userInfo != null) {
      return this.check(this.userInfo.role, ['AT_CON_PRO', 'AT_ADMIN', 'ADMIN']);
    }
    else {
      if (localStorage.getItem('userInfo')) {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if(this.userInfo == undefined || this.userInfo == null)
            return false;
        return this.check(this.userInfo.role, ['AT_CON_PRO', 'AT_ADMIN', 'ADMIN']);
      } else {
        return false;
      }
    }
  }

  canGrammar() {
    if(this.userInfo != null) {
      return this.check(this.userInfo.role, ['GRAMMAR_ADMIN', 'GR_CON_PRO', 'GR_ADMIN', 'ADMIN']);
    }
    else {
      if (localStorage.getItem('userInfo')) {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if(this.userInfo == undefined || this.userInfo == null)
            return false;
        return this.check(this.userInfo.role, ['GRAMMAR_ADMIN', 'GR_CON_PRO', 'GR_ADMIN', 'ADMIN']);
      } else {
        return false;
      }
    }
  }

  canStreaming() {
    if(this.userInfo != null) {
      return this.check(this.userInfo.role, ['ST_ADMIN', 'ADMIN']);
    }
    else {
      if (localStorage.getItem('userInfo')) {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if(this.userInfo == undefined || this.userInfo == null)
            return false;
        return this.check(this.userInfo.role, ['ST_ADMIN', 'ADMIN']);
      } else {
        return false;
      }
    }
  }


  createTest(url, type) {
    if (type == undefined || type == null)
      type = 'testingtool';
    if (url == undefined || url == null)
      url = '/home/testingtool/testedit';
    url = '/home/' + type + '/testedit';
    this.homeService.requestCreateTest(null, type)
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          this.testEventService.notify('OK');
          this.openSnackBar('Created test successful!');
          const navigationExtras: NavigationExtras = {
            queryParams: {
              id: res.response.TestId
            }
          };
          this.router.navigate([url], navigationExtras);
        } else {
          console.error('Server error');
          this.processStatusError(res.errors);
        }
      });
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  loadUsers() {
    return;
    //this.homeService.requestGet('/createUsers?path=/tmp&filename=userLoad.csv');
  }

}
