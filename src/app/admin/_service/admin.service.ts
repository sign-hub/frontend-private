import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {BaseService} from '../../share/base.service';
import {User} from '../_model/user';

@Injectable()
export class AdminService extends BaseService {

  constructor(protected http: Http) {
    super(http);
  }

  getUsers(role: string, email: string, name: string) {
    let url = 'user';
    let params: string;
    let params2: string;
    let params3: string;
    if (role) {
      params = '&role=' + role;
    }
    if (email) {
      params2 = '&email=' + email;
    }
    if (name) {
      params3 = 'name=' + name;
    } else {
      params3 = 'name=';
    }
    if (role || email || name) {
      url += '?';
      url += params3;
      if (role) {
        url += params;
      }
      if (email) {
        url += params2;
      }
    }
    return this.requestGet(url);
  }

  saveUser(user: User) {
    const obj: any = {};
    obj.user = user;
    return this.requestPost('user', obj);
  }

  updateUser(user: User) {
    const obj: any = {};
    obj.user = user;
    return this.requestPost('user/' + user.userId, obj);
  }

  deleteUser(userId: string) {
    return this.requestDelete('user/' + userId);
  }
}
