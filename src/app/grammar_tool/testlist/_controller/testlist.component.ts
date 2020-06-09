import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { TestListService } from '../_service/testlist.service';
import { NavigationExtras, Router } from '@angular/router';
import { MdDialog, MdSnackBar } from '@angular/material';
import { TestSmall } from '../_model/testSmall';
import { TestEventService } from '../../../home/_service/testEvent.service';
import { DeleteTestComponent } from './delTest.component';
import { ProfileSerivce } from '../../../profile/_service/profile.service';
import { Baseconst } from 'app/share/base.constants';

@Component({
  selector: 'app-testlist',
  templateUrl: '../_views/testlist.component.html',
  styleUrls: ['../_views/testlist.component.scss', '../../../share/e-home.scss']
})
export class TestListComponent extends BaseComponent implements OnInit {

  data: Array<TestSmall>;
  loading: boolean;
  isEdit: boolean;
  isRemove: boolean;
  test: TestSmall;
  isLoading: boolean;
  user: any;

  constructor(private testListService: TestListService,
    protected router: Router,
    public mdSnackBar: MdSnackBar,
    public dialog: MdDialog,
    public profileService: ProfileSerivce,
    public testEventService: TestEventService) {
    super(router, mdSnackBar);
    this.testEventService.fireEvent.subscribe(res => {
      if (res === 'OK') {
        this.init();
      }
    });
  }

  loadUserInfo() {
    const userStr: string = localStorage.getItem('userInfo');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      this.profileService.getUserCurrent().subscribe(res => {
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
  ngOnInit() {
    this.loading = false;
    this.isEdit = false;
    this.isRemove = false;
    this.loadUserInfo();
    this.init();
  }

  init() {
    this.loading = true;
    this.data = [];
    this.testListService.getTestList().subscribe(res => {
      if (res.status === 'OK') {
        this.data = res.response;
        this.data = this.data.filter(function (e) {
          return !e.deleted;
        });
        if (this.data.length > 0) {
          this.data[0].checked = true;
          this.chooseTest(this.data[0]);
        }
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.loading = false;
    });
  }

  editTest() {
    if (this.test) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: this.test.uuid
        }
      };
      this.router.navigate(['/home/grammar_tool/grammaredit'], navigationExtras);
    } else {
      this.openSnackBar('Please choose a test!');
    }
  }

  private unSelectedAll(id) {
    if (this.data && this.data.length > 0) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].uuid !== id) {
          this.data[i].checked = false;
        }
      }
    }
  }

  chooseTest(test) {

    this.unSelectedAll(test.uuid);
    if (test.checked) {
      this.test = test;
      const userId: string = localStorage.getItem('userId');
      this.isRemove = userId === test.authorId ? true : false;
      this.isEdit = test.toEdit;
    } else {
      this.test = null;
    }
  }

  deleteTest() {
    if (this.test) {
      const d = this.dialog.open(DeleteTestComponent, { disableClose: true, data: this.test });
      d.afterClosed().subscribe(res => {
        if (res === 'OK') {
          this.init();
        }
      });
    } else {
      this.openSnackBar('Please choose a grammar!');
    }
  }

  addGrammar() {
    this.isLoading = true;
    this.testListService.addGrammar().subscribe(res => {
      if (res.status === 'OK') {
        this.openSnackBar('Grammar successfully created!');
        if (res.response.uuid) {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              id: res.response.uuid
            }
          };
          this.router.navigate(['/home/grammar_tool/grammaredit'], navigationExtras);
        } else {
          this.openSnackBar('Please choose a test!');
        }
      } else {
        this.processStatusError(res.errors);
        console.error('Server error');
      }
      this.isLoading = false;
    });
  }

  openTestView() {

    if (this.test) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: this.test.uuid,
          preview: false
        }
      };
      this.router.navigate(['/home/grammar_tool/grammarview'], navigationExtras);
    } else {
      this.openSnackBar('Please choose a grammar!');
    }
  }

  showPdf() {
    if (this.test == undefined || this.test == null)
      return '#';
    return Baseconst.getCompleteBaseUrl() + 'downloadGrammar/' + this.test.uuid + '/pdf';
  }
  showHtml() {
    if (this.test == undefined || this.test == null)
      return '#';
    return Baseconst.getCompleteBaseUrl() + 'downloadGrammar/' + this.test.uuid + '/html';
  }
}
