import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Routes } from '@angular/router';

@Injectable()
export class AtlasGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {
  }

  canActivate() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (window.location.hash.indexOf('atlas') == -1 && userInfo['role'] == 'AT_CON_PRO') {
      this.router.navigate(['home/atlas']);
      return false;

    }
    return true;
  }

  canActivateChild() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (window.location.hash.indexOf('atlas') == -1 && userInfo['role'] == 'AT_CON_PRO') {
      this.router.navigate(['home/atlas']);
      return false;
    }
    return true;
  }

  checkRole() {

    return true;
  }
}
