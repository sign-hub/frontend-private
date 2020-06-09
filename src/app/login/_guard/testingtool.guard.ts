import { PlatformGuard } from 'app/login/_guard/platform.guard';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Routes } from '@angular/router';

@Injectable()
export class TestingToolGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {
  }

  canActivate() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo['role'] == 'TT_EDITOR' || userInfo['role'] == 'TT_USER') {
      this.router.navigate(['home/testingtool']);
      return false;

    }
    return true;
  }

  canActivateChild() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo['role'] == 'TT_EDITOR' || userInfo['role'] == 'TT_USER') {
      this.router.navigate(['home/testingtool']);
      return false;
    }
    return true;
  }

  checkRole() {
    return true;
  }
}
