import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs';
import {BaseService} from '../../share/base.service';


@Injectable()
export class TestPlayerService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }

  requetGetTest(id) {
    return this.requestGet('test/' + id + '?complete=true');
  }

  requestGetQuestionInfo(id) {
    return this.requestGet('question/' + id + '?complete=true');
  }

  requestAddSlide(questionId) {
    const obj: any = {};
    obj.questionId = questionId;
    return this.requestPost('slide', obj);
  }

  requestUpdateSlide(slideId, data) {
    const obj: any = {};
    obj.slide = data;
    return this.requestPost('slide/' + slideId, obj);
  }

  requestCreateReport(data) {
    console.log("requestCreateReport" + JSON.stringify(data))
    return this.requestPost('report', data);
  }

}
