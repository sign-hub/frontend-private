import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { BaseService } from '../../../share/base.service';

@Injectable()
export class ReportdownloadService extends BaseService {

  constructor(protected http: Http) {
    super(http);
  }

  downloadCsv(param) {
    return this.requestGet(`media/retrieve?repositoryId=${param}&getPublic=true`);
  }

}
