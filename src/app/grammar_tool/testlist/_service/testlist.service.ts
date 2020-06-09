import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BaseService} from '../../../share/base.service';

@Injectable()
export class TestListService extends BaseService {

  constructor(protected http: Http) {
    super(http);
  }

  addGrammar(){
    return this.requestPost('grammar', {});
  }

  getTestList() {
    return this.requestGet('grammar');
  }

  deleteTest(id) {
    return this.requestDelete('test/' + id);
  }

  cloneTest(id) {
    const obj: any = {};
    obj.testId = id;
    return this.requestPost('cloneTest', obj);
  }


}
