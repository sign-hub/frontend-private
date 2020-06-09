import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../share/base.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ViewService } from '../_services/view.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Video } from '../../_model/video';

@Component({
  selector: 'app-view',
  templateUrl: '../_views/view.component.html',
  styleUrls: ['../../../share/e-home.scss', '../_views/view.component.scss' ]
})
export class ViewComponent extends BaseComponent implements OnInit {

  isLoading: boolean;
  listView = false;
  gridView = true;
  video : Video;
  heightMedia: any;
  showCopy = false;
  copyLink: any;
  args: any;

  constructor(public dialog: MdDialog,
    private viewService: ViewService,
    protected router: Router,
    private route: ActivatedRoute,
    public mdSnackBar: MdSnackBar) {
    super(router, mdSnackBar);
  }

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      if (params == undefined || params == null ||
        params.id == undefined || params.id == null || params.id == ''){
          const navigationExtras: NavigationExtras = {
          };
          this.router.navigate(['/home/streaming_tool/viewstreams'], navigationExtras);
          this.mdSnackBar.open('No video selected');
          return;
        }
      this.viewService.requestgetVideo(params.id).subscribe(res => {
        // if (res.status === 'OK') {
          this.video = res;
          console.log(this.video);
        // } else {
          // console.error('Server error');
          // this.processStatusError(res.errors);
        // }
        this.isLoading = false;
        this.args = {
          url:'',
          title:'',
          via:'',
          tags:''
        };
        this.args = {
          url: window.location.href,
          title: this.video.name
        };
      }, err => {
        console.error('Server error');
        this.processStatusError(err);
      });
    });
    this.copyLink = window.location.href;
  }

  getFacebookLink() {
    //return "http://www.google.com";
    let shareUrl = 'https://www.facebook.com/sharer/sharer.php';
    shareUrl += `?u=${this.args.url}`;

    if (this.args.title) {
        shareUrl += `&title=${this.args.title}`;
    }
    if (this.args.description) {
        shareUrl += `&description=${this.args.description}`;
    }
    if (this.args.image) {
        shareUrl += `&picture=${this.args.image}`;
    }
    return shareUrl;
  }

  getTwitterLink() {
    //return "http://www.google.it";
    let shareUrl = 'https://twitter.com/intent/tweet';
    shareUrl += `?url=${this.args.url}`;

    if (this.args.title) {
        shareUrl += `&text=${this.args.title}`;
    }
    if (this.args.via) {
        shareUrl += `&via=${this.args.via}`;
    }
    if (this.args.tags) {
        shareUrl += `&hashtags=${this.args.tags}`;
    }

    return shareUrl;
  }

  toggleCopyLink() {
    this.showCopy = !this.showCopy;
    console.log(this.showCopy);
  }

}
