import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {BaseService} from '../../share/base.service';
import {TestSmall} from '../../testlist/_model/testSmall';

@Injectable()
export class GrammrToolService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }

  requestCreateTest(test: TestSmall) {
    const obj: any = {};
    obj.test = test;
    return this.requestPost('grammar_tool/test', obj);
  }
}
