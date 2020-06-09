import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { BaseService } from '../../../share/base.service';


@Injectable()
export class TestPlayerService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }


  requestGetGrammar(id) {
    return this.requestGet('grammar?grammarId=' + id);
  }

  requestGetGrammarPart(id: string) {
    return this.requestGet('grammarpart?grammarPartId=' + id);
  }

  requestUpdateGrammarPart(id: string, grmPart: any) {
    return this.requestPost('grammarpart?grammarPartId=' + id, { grammarPart: grmPart });
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
    return this.requestPost('report', data);
  }

}
