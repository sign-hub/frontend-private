import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { NavigationExtras, Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { ManagementService } from '../_services/management.service';

@Component({
  selector: 'app-management',
  templateUrl: '../_views/management.component.html',
  styleUrls: ['../_views/management.component.scss', '../../../share/e-home.scss']
})
export class ManagementComponent extends BaseComponent implements OnInit {

  loading: boolean;
  users: any;
  tests: any;
  private data = [];

  constructor(
    private managementService: ManagementService,
    protected router: Router,
    protected ngZone: NgZone,
    public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
    this.loading = false;
  }

  ngOnInit() {

    this.loading = true;
    Observable.forkJoin(
      this.managementService.getTests(),
      this.managementService.getUsers()
    ).subscribe((data: any) => {
      this.tests = data[0].response;
      this.users = data[1].response;
      this.constructData(data[0].response);
      this.cusntructUserData(data[1].response, data[0].response);
      this.loading = false;
    }, error => console.log(error));
  }

  constructData(test: any) {
    test.forEach((element: any) => {
      if (element.contentProviders.length > 0) {
        const item = {
          testId: element.TestId,
          contentProviderIds: element.contentProviders
        }
        this.data.push(item);
      }
    });
  }

  cusntructUserData(users: any, tests: any) {
    users.forEach((user: any) => {
      user.values = [];
      tests.forEach((element: any) => {
        let values = {
          checked: 'false',
          testId: element.TestId
        };
        element.contentProviders.forEach(users => {
          if (user.userId === users) {
            values.checked = 'true';
          }
        });
        user.values.push(values)
      });
    });
  }

  checkboxState(userId: string, testId: string) {
    let foundTest = this.data.find((x: any) => x.testId === testId);
    if (foundTest) {
      const foundUsers = foundTest.contentProviderIds.find((x: any) => x === userId)
      const testindex = this.data.indexOf(foundTest);
      if (foundUsers) {
        const index = foundTest.contentProviderIds.indexOf(foundUsers);
        foundTest.contentProviderIds.splice(index, 1);
        if (foundTest.contentProviderIds.length === 0)
          this.data.splice(testindex, 1);
      } else {
        foundTest.contentProviderIds.push(userId)
      }
    } else {
      const item = {
        testId: testId,
        contentProviderIds: new Array(userId)
      }
      this.data.push(item)
    }
  }

  save() {
    this.loading = true;
    const obj: any = {};
    obj.management = this.data
    console.log(obj)
    this.managementService.postManagment(obj).subscribe((res: any) => {
      console.log(res)
      this.loading = false;
      this.openSnackBar('Data saved correctly');
    }, (error) => {
      console.log(error);
      this.loading = false;
    }
    );
  }

  openSnackBar(message: string) {
    const snackBarOption = new MdSnackBarConfig();
    snackBarOption.duration = 3000;
    this.snackBar.open(message, '', snackBarOption);
  }

}
