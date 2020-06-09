import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../../../share/base.service';

@Injectable()
export class TestListService extends BaseService {

  constructor(protected http: Http) {
    super(http);
  }

  getTestList() {
    return this.requestGet('atlas/test?orderby=testName&ordertype=ASC');
  }

  deleteTest(id) {
    return this.requestDelete('test/' + id);
  }

  cloneTest(id) {
    const obj: any = {};
    obj.testId = id;
    return this.requestPost('cloneTest', obj);
  }

  generateReport(id) {
    return this.requestGet(`atlas/generateReport?testId=${id}`);
  }

  checkReport(code) {
    return this.requestGet(`atlas/checkReport?reportId=${code}`);
  }

  downloadReport(code) {
    return this.requestGet(`atlas/downloadReport?reportId=${code}`);
  }

  generateFeatures(id) {
    return this.requestGet(`atlas/generateFeatures?testId=${id}`);
  }

  checkFeatures(code) {
    return this.requestGet(`atlas/checkFeatures?workerId=${code}`);
  }
}
