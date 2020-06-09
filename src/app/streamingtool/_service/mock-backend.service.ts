import { Injectable } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Video } from '../_model/video';
import { ResponseOptions, Response } from '@angular/http';
import { Baseconst } from '../../share/base.constants';


@Injectable()
export class MockBackendService {
  constructor(
    private backend: MockBackend
  ) {
  }
  public started = false;
  // Fake Tickets DB
  public db: Video[] = [
    new Video(
      '1', 'AT_02_taglio.mp4', "00':50\"", "25mb", "720p", 'gg mm aaaa', ['text', 'text', 'text'],
      'AT_02_taglio.mp4 description', '/api/rest/public/videos1/AT_02_taglio.jpg', '/api/rest/public/videos1/AT_02_taglio.mp4', [{ url: '/api/rest/public/videos1/T2.4-LIS-F-AT02-1-20170708.vtt', label: 'Italiano' }]),
    new Video(
      '2', 'SA_03_taglio.mp4', "00':50\"", "25mb", "720p", 'gg mm aaaa', ['text', 'text', 'text'],
      'SA_03_taglio.mp4 description', '/api/rest/public/videos1/SA_03_taglio.jpg', '/api/rest/public/videos1/SA_03_taglio.mp4', [{ url: '/api/rest/public/videos1/T2.4-LIS-M-SA03-1-20180103.vtt', label: 'Italiano' }]),
    new Video(
      '3', 'MI_01_taglio.mp4', "00':50\"", "25mb", "720p", 'gg mm aaaa', ['text', 'text', 'text'],
      'MI_01_taglio.mp4 blue description', '/api/rest/public/videos1/SA_03_taglio.jpg', '/api/rest/public/videos1/MI_01_taglio.mp4', [{ url: '/api/rest/public/videos1/MI_01_taglio.mp4', label: 'Italiano' }]),
    new Video(
      '4', 'RM_02_Taglio.mp4', "00':50\"", "25mb", "720p", 'gg mm aaaa', ['text', 'text', 'text'],
      'RM_02_Taglio.mp4 description', '/api/rest/public/videos1/RM_02_Taglio.jpg', '/api/rest/public/videos1/RM_02_Taglio.mp4', [{ url: '/api/rest/public/videos1/T2.4-LIS-F-RM02-1-20170609.vtt', label: 'Italiano' }]),
    new Video(
      '5', 'T2.4-TID-M01-1-20161115_new.mp4', "00':50\"", "25mb", "720p", 'gg mm aaaa', ['text', 'text', 'text'],
      'T2.4-TID-M01-1-20161115_new.mp4 description', '/api/rest/public/videos1/T2.4-TID-M01-1-20161115_new.jpg', '/api/rest/public/videos1/T2.4-TID-M01-1-20161115_new.mp4', [{ url: '/api/rest/public/videos1/T2.4-TID-M01-1-20161115_newTID_UTF.vtt', label: 'Türkçe' }, { url: '/api/rest/public/videos1/T2.4-TID-M01-1-20161115_newENG_UTF.vtt', label: 'English' }]),
  ];
  start(): void {
    this.backend.connections.subscribe((c: MockConnection) => {
      const URL = Baseconst.getPartialBaseUrl();
      const videosSearchRegex = /\/videos\?search=(.+)/i;
      const videoIdRegex = /\/video\/([0-9]+)/i;
      const videos = 'videos';


      if (c.request.url.match(videosSearchRegex) && c.request.method === 0) {

        const matches = this.db.filter((video) => {
          if (video.name.indexOf(c.request.url.match(videosSearchRegex)[1]) != -1) {
            return true;
          } else if (video.description.indexOf(c.request.url.match(videosSearchRegex)[1]) != -1) {
            return true;
          } else {
            return false;
          }
        });
        c.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(matches)
        })));
      } else if (c.request.url.match(videoIdRegex) && c.request.method === 0) {
        const matches = this.db.filter((video) => {
          return video.id === c.request.url.match(videoIdRegex)[1];
        });
        c.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(matches[0])
        })));
      } else if (c.request.url.match(videos)) {
        c.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(this.db)
        })));
      }
    }, err => {
      console.log(err);
    });
  }

  finish(): void {
    this.backend.connections.close();
    this.backend.connections.unsubscribe();
  }
}
