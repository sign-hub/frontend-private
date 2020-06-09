import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';
import { BaseService } from '../../../share/base.service';

@Injectable()
export class MediaService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }

 requestLoadVideos(search: string) {
    return this.requestGet('videos?search=' + search);
 }

 requestLoadAllVideos(): Observable<any> {
   return this.requestGet('videos');
}

 requestgetVideo(id: string) {
    return this.requestGet('video/' + id);
 }

}