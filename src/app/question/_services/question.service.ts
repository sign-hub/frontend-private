import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs';
import {BaseService} from '../../share/base.service';


@Injectable()
export class QuestionService extends BaseService {
  constructor(protected http: Http) {
    super(http);
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

  deleteSlide(id) {
    return this.requestDelete('slide/' + id);
  }

}
