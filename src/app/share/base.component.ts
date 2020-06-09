import { Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Error } from './_model/error';
import { Baseconst } from './base.constants';

export abstract class BaseComponent {
  wHeight: string;
  height: number;
  width: number;
  url: string;

  constructor(protected router: Router,
    protected snackBar: MdSnackBar) {
    this.height = (window.screen.height - 200);
    //this.height = (window.innerHeight);
    this.width = (window.screen.width);
    //this.width = (window.innerWidth);
    this.wHeight = this.height + 'px';
    this.url = Baseconst.getPartialBaseUrl();
  }

  processStatusError(errors: Error[]) {
    if (errors && errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        const error = errors[i];
        switch (error.errorCode) {
          case 3:
            localStorage.clear();
            this.openSnackBar('Token expired, please login again');
            this.router.navigate(['/authen/login']);
            break;
          default:
            this.openSnackBar(error.errorMessage);
            console.error(error.errorCode);
            break;
        }
      }
    }
  }

  openSnackBar(message: string) {
    const snackBarOption = new MdSnackBarConfig();
    snackBarOption.duration = 3000;
    this.snackBar.open(message, '', snackBarOption);
  }
}
