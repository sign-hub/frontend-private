import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { BaseService } from 'app/share/base.service';

@Injectable()
export class ManagementService extends BaseService {

  constructor(protected http: Http) {
    super(http);
  }

  getUsers() {
    return this.requestGet('user?name=&role=AT_CON_PRO');
  }

  getTests() {
    return this.requestGet('atlas/test?orderby=testName&ordertype=ASC');
  }

  postManagment(data: any) {
    return this.requestPost('atlas/management', data);
  }
}
