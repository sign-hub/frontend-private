import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Routes } from '@angular/router';

@Injectable()
export class AuthenGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin(state);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin(state);
  }

  checkLogin(state) {

    if (localStorage.getItem('token')) {
      return true;
    }
    const url = state.url.split('?');
    console.log(url);
    localStorage.setItem('prevUrl', JSON.stringify({ url: url[0], params: state.root.queryParams }));

    this.router.navigate(['/authen']);
    return false;
  }
}
