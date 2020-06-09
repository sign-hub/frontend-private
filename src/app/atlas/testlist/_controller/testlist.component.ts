import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { TestListService } from '../_service/testlist.service';
import { NavigationExtras, Router } from '@angular/router';
import { MdDialog, MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { TestSmall } from '../_model/testSmall';
import { TestEventService } from '../../../home/_service/testEvent.service';
import { DeleteTestComponent } from './delTest.component';
import { ProfileSerivce } from '../../../profile/_service/profile.service';
import { Baseconst } from 'app/share/base.constants';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-testlist',
  templateUrl: '../_views/testlist.component.html',
  styleUrls: ['../_views/testlist.component.scss', '../../../share/e-home.scss']
})
export class TestListComponent extends BaseComponent implements OnInit, OnDestroy {
  data: Array<TestSmall>;
  loading: boolean;
  isEdit: boolean;
  isRemove: boolean;
  test: TestSmall;
  isLoading: boolean;
  user = {};
  role = JSON.parse(localStorage.getItem('userInfo')).role;
  private _unsubscribeAll: Subject<any>;

  filter_name: string;
  allTests: Array<TestSmall>;
  constructor(private testListService: TestListService,
    protected router: Router,
    public mdSnackBar: MdSnackBar,
    public dialog: MdDialog,
    public profileSerivce: ProfileSerivce,
    public testEventService: TestEventService) {
    super(router, mdSnackBar);
    this._unsubscribeAll = new Subject();
    this.testEventService.fireEvent.subscribe(res => {
      if (res === 'OK') {
        this.init();
      }
    });
  }

  ngOnInit() {
    this.loading = false;
    this.isEdit = false;
    this.isRemove = false;
    this.init();

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  loadUserInfo() {
    const userStr: string = localStorage.getItem('userInfo');
    if (userStr) {
      this.user = JSON.parse(userStr);
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

  init() {
    this.loading = true;
    this.data = [];
    this.testListService.getTestList()
      .takeUntil(this._unsubscribeAll)
      .subscribe(res => {
        if (res.status === 'OK') {
          this.data = res.response;
          this.data = this.data.filter(function (e) {
            return !e.deleted;
          });
          console.log(this.data)
          if (this.data.length > 0) {
            this.data[0].checked = true;
            this.chooseTest(this.data[0]);
            this.allTests = this.data;
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
          id: this.test.TestId
        }
      };
      this.router.navigate(['/home/atlas/testedit'], navigationExtras);
    } else {
      this.openSnackBar('Please choose a test!');
    }
  }

  private unSelectedAll(id) {
    if (this.data && this.data.length > 0) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].TestId !== id) {
          this.data[i].checked = false;
        }
      }
    }
  }

  chooseTest(test) {
    this.unSelectedAll(test.TestId);
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
      d.afterClosed()
        .takeUntil(this._unsubscribeAll)
        .subscribe(res => {
          if (res === 'OK') {
            this.init();
          }
        });
    } else {
      this.openSnackBar('Please choose a test!');
    }
  }

  cloneTest() {
    if (this.test) {
      this.isLoading = true;
      this.testListService.cloneTest(this.test.TestId)
        .takeUntil(this._unsubscribeAll)
        .subscribe(res => {
          if (res.status === 'OK') {
            this.openSnackBar('Clone test successful!');
            this.init();
          } else {
            this.processStatusError(res.errors);
            console.error('Server error');
          }
          this.isLoading = false;
        });
    } else {
      this.openSnackBar('Please choose a test!');
    }

  }

  doFilter() {
    if (this.filter_name == undefined) {
      return;
    }
    this.data = this.allTests.filter((test) => {
      if (test.TestName.toLowerCase().indexOf(this.filter_name.toLowerCase()) !== -1) {
        return true;
      } else {
        return false;
      }
    });
  }


  openTestView() {
    if (this.test) {
      if (this.test['reportId']) {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: this.test.TestId,
            preview: false,
            report_id: this.test['reportId']
          }
        };
        this.router.navigate(['/home/atlas/testplayer'], navigationExtras);
      } else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: this.test.TestId,
            preview: false
          }
        };
        this.router.navigate(['/home/atlas/testplayer'], navigationExtras);
      }

    } else {
      this.openSnackBar('Please choose a test!');
    }
  }

  generateReport() {
    if (this.test) {
      this.testListService.generateReport(this.test.TestId)
        .takeUntil(this._unsubscribeAll)
        .subscribe((res: any) => {
          if (res.status === 'OK') {
            const downloading = setInterval(() => {
              this.testListService.checkReport(res.response.workerId)
                .takeUntil(this._unsubscribeAll)
                .subscribe((res: any) => {
                  console.log(res)

                  if (res.status === 'OK' && res.response.status === 'COMPLETE') {
                    clearInterval(downloading)
                    this.testListService.downloadReport(res.response.id)
                      .takeUntil(this._unsubscribeAll)
                      .subscribe((res: any) => {
                        console.log(res && res.url)
                        if (res) {
                          const newWindow = window.open(Baseconst.getPartialBaseUrl() + '/reportcsvpublic/' + res.url);
                        }
                      }, error => console.log(error))
                  } else {
                    this.openSnackBar(res.response.status)
                  }
                }, error => console.log(error))
            }, 15 * 1000)
          } else {
            this.openSnackBar(res.errors[0].errorMessage)
          }
        }, error => console.log(error));

    }
  }

  generateFeatures() {
    if (this.test) {
      this.testListService.generateFeatures(this.test.TestId)
        .takeUntil(this._unsubscribeAll)
        .subscribe((res: any) => {

          if (res.status === 'OK') {
            const downloading = setInterval(() => {
              this.testListService.checkFeatures(res.response.workerId)
                .takeUntil(this._unsubscribeAll)
                .subscribe((res: any) => {

                  if (res.status === 'OK' && res.response.status === 'COMPLETE') {
                    clearInterval(downloading)
                    this.openSnackBar('Features Generated')
                  } else {
                    this.openSnackBar(res.response.status)
                  }
                }, error => console.log(error))

            }, 15 * 1000)
          } else {
            this.openSnackBar(res.errors[0].errorMessage)
          }
        }, error => console.log(error));

    }
  }

  openSnackBar(message: string) {
    const snackBarOption = new MdSnackBarConfig();
    snackBarOption.duration = 3000;
    this.snackBar.open(message, '', snackBarOption);
  }

}
