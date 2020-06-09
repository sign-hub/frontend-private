import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MENUS} from '../../home/menu.const';
import {HomeService} from '../../home/_service/home.service';
import {ProfileSerivce} from '../../profile/_service/profile.service';
import {BaseComponent} from '../../share/base.component';
import {MdSnackBar} from '@angular/material';
import {MdDialog} from '@angular/material';
import { StreamingToolService } from '../_service/streamingtool.service';
import { MockBackendService } from '../_service/mock-backend.service';

@Component({
  selector: 'app-home',
  templateUrl: '../_views/streamingtool.component.html',
  styleUrls: ['../_views/streamingtool.component.scss'],
  providers: [MockBackendService]
})
export class StreamingToolComponent extends BaseComponent implements OnInit, OnDestroy {
  menus: any;
  user: any;
  movies: any;

  constructor(public router: Router,
              private translate: TranslateService,
              private homeService: HomeService,
              private profileSerivce: ProfileSerivce,
              public dialog: MdDialog,
              private mockBackendService: MockBackendService,
              private streamingToolService: StreamingToolService,
              public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
    this.menus = MENUS;
    /*this.mockBackendService.start();*/
  }

  ngOnInit() {
    this.mockBackendService.start();
    this.user = {};
    this.loadUserInfo();
    if (localStorage.getItem('userInfo') !== null && JSON.parse(localStorage.getItem('userInfo')).role == 'AT_CON_PRO'){
      this.router.navigate(['home/atlas']);
      return true;
    }
  }

  ngOnDestroy(){
    this.mockBackendService.finish();
  }

  search(searchTerm: string){

    this.streamingToolService.requestLoadVideos('v').subscribe(res => {
      this.movies = res;
    });
  }

  selectVideo(id){

    this.streamingToolService.requestgetVideo('4').subscribe(res => {
      console.log(res);
    });
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

  createTest(){

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

  changeLang(lang: string) {
    this.translate.use(lang);
  }
}

