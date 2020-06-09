import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';
import { BaseService } from '../../../share/base.service';

@Injectable()
export class MediaService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }

  getMedia(type: string) {
    return this.requestGet('grammar/media?mediaType=' + type);
  }

  getMediaById(id: string) {
    return this.requestGet('media/id');
  }

  getMediaByTestId(id: string) {
    return this.requestGet('grammar/media?grammarId=' + id);
  }

  deleteMedia(id: string) {
    return this.requestDelete('grammar/media/' + id);
  }

  filterMedia(type: string, mediaName: string, mediaAuthor: string, mediaDate: string, pageIndex?: number, length?: number, folderId?: string, isFolder?: boolean) {
    let uri: string = 'grammar/media?mediaType=' + type;
    if (isFolder) {
      uri = 'grammar/media?mediaType=' + type + '&parentId=' + folderId;
    }
    if (mediaName && mediaName.length > 0) {
      uri += '&mediaName=' + mediaName;
    }
    if (mediaAuthor && mediaAuthor.length > 0) {
      uri += '&mediaAuthor=' + mediaAuthor;
    }
    if (mediaDate && mediaDate.length > 0) {
      uri += '&mediaDate=' + mediaDate;
    }
    if (pageIndex && pageIndex > 0) {
      uri += '&page=' + pageIndex;
    }
    if (length && length > 0) {
      uri += '&length=' + length;
    }
    return this.requestGet(uri);
  }
};
