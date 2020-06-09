import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Routes } from '@angular/router';

@Injectable()
export class PlatformGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {
  }

  getTool(state: RouterStateSnapshot) {
    const splitted = state.url.split('/');
    if (splitted.length >= 3)
      return splitted[2];
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //console.log(state);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let tool = this.getTool(state);
    console.log('platformguard canActivate ' + tool + " " + userInfo['role']);
    return this.check(tool, userInfo['role']);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let tool = this.getTool(state);
    return this.check(tool, userInfo['role']);
  }

  check(tool, role) {
    switch (tool) {
      case 'admin':
        return role === 'ADMIN';
      case 'testingtool':
        return ['TT_USER', 'TT_EDITOR', 'TT_ADMIN', 'ADMIN'].includes(role);
      case 'atlas':
        return ['AT_CON_PRO', 'AT_ADMIN', 'ADMIN'].includes(role);
      case 'grammar_tool':
        return ['GRAMMAR_ADMIN', 'GR_CON_PRO', 'GR_ADMIN', 'ADMIN'].includes(role);
      case 'streaming_tool':
        return ['ST_ADMIN', 'ADMIN'].includes(role);
      default:
        return false;
    }
  }

  checkRole() {

    return true;
  }
}
