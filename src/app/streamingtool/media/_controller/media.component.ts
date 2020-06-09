import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MediaService } from '../_services/media.service';
import { Router } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Video } from 'app/streamingtool/_model/video';
import { Store } from '@ngrx/store';
import * as video from '../_store/actions/media.actions';
import * as fromRoot from '../_store/reducers';

@Component({
  selector: 'app-media',
  templateUrl: '../_views/media.component.html',
  styleUrls: ['../../../share/e-home.scss', '../_views/media.component.scss' ]
})
export class MediaComponent extends BaseComponent implements OnInit {
  heightMedia: string;
  picker: any;
  selectedImage: string;
  tabIndex: number;
  isLoading: boolean;
  pickerVideo: any;
  dateFormater: DatePipe;
  videos: any;
  input: string;
  sortBy: any;
  selected = 'id';
  listView = false;
  gridView = true;
  ascending = true;
  submitted = false;
  descending = false;
  searchQuery: string;
  searchQuery$: Observable<string>;
  videos$: Observable<Video[]>;
  loading$: Observable<boolean>;

  constructor(public dialog: MdDialog,
    private mediaService: MediaService,
    protected router: Router,
    public mdSnackBar: MdSnackBar,
    private store: Store<fromRoot.State>) {
    super(router, mdSnackBar);
    this.dateFormater = new DatePipe('en-US');
    this.searchQuery$ = store.select(fromRoot.getSearchQuery);
    this.videos$ = store.select(fromRoot.getSearchResults).map((res: any) => {
      return res.sort((a, b) => {
        if (a[this.selected] < b[this.selected]) return -1;
        else if (a[this.selected] > b[this.selected]) return 1;
        else return 0;
      });
    });
    this.loading$ = store.select(fromRoot.getSearchLoading);
  }

  ngOnInit() {
    this.searchQuery$.subscribe((res => {
      if (!res || res === ''){
        this.store.dispatch(new video.SearchAction(''));
      } else {
        this.input = res;
      }
    }));
  }

  clear(){
    this.input = null;
    this.store.dispatch(new video.SearchAction(''));
  }

  search(){
    this.searchQuery = this.input;
    this.store.dispatch(new video.SearchAction(this.searchQuery));
  }

  filterVideosAscending(){
    const videos = this.videos;
    this.videos = null;
    this.videos$ = this.store.select(fromRoot.getSearchResults).map((res: any) => {
      return res.sort((a, b) => {
        if (a[this.selected] < b[this.selected]) return -1;
        else if (a[this.selected] > b[this.selected]) return 1;
        else return 0;
      });
    });
  }

  filterVideosDescending(){
    const videos = this.videos;
    this.videos = null;
    this.videos$ = this.store.select(fromRoot.getSearchResults).map((res: any) => {
      return res.sort((a, b) => {
        if (a[this.selected] > b[this.selected]) return -1;
        else if (a[this.selected] < b[this.selected]) return 1;
        else return 0;
      });
    });
  }
  setListView(){
    this.listView = true;
    this.gridView = false;
  }

  setGridView(){
    this.listView = false;
    this.gridView = true;
  }

  orderBy(){
    if (this.ascending){
      this.ascending = false;
      this.descending = true;
      this.filterVideosDescending();
    } else if (this.descending) {
      this.descending = false;
      this.ascending = true;
      this.filterVideosAscending();
    }
  }


  order(value){
    if (this.ascending){
      this.selected = value;
      this.filterVideosAscending();
    } else if (this.descending) {
      this.selected = value;
      this.filterVideosDescending();
    }
  }

}
