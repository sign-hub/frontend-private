import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {BaseService} from '../../share/base.service';

@Injectable()
export class StreamingToolService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }

 requestLoadVideos(search: string) {
    return this.requestGet('videos?search=' + search);
 }

requestgetVideo(id: string) {
   return this.requestGet('public/videos1/'+id);
}
 

}
