import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';
import { BaseService } from '../../../share/base.service';

@Injectable()
export class UploadedMediasService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }

  getReport() {
    return this.requestGet('atlas/report');
  }

  getMediaById(id: string) {
    return this.requestGet('reportUploaded/' + id);
  }

  getPublicUrl(id){
    return this.requestGet('/media/retrieve?id=' + id);
  }

  downloadCsv(id) {
    return this.requestGet('reportcsv/' + id);
  }
}