import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { MediaComponent } from './media.component';
import { Photo } from '../_model/photo';


@Component({
  selector: 'app-dialog-preview',
  templateUrl: '../_views/preview.component.html',
  styleUrls: ['../_views/preview.component.scss']
})
export class DialogPreviewComponent {
  image: Photo;
  isLoading: boolean;
  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
    this.image = data;
    this.isLoading = true;
  }

  doneLoading(e) {
    console.log(e);
    this.isLoading = false;
  }
}
