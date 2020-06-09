
import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../../share/base.component';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-textarea',
  templateUrl: '../_views/textblock.component.html',
  styleUrls: ['../_views/textblock.component.scss', '../../share/e-home.scss']
})
export class TextBlockComponent extends BaseComponent implements OnInit {
  input: any;
  color: any;

  constructor(public mdSnackBar: MdSnackBar,
              protected router: Router,
              public dialogRef: MdDialogRef<TextBlockComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.input = this.data;
  }

  ngOnInit(): void {
    console.log('init');
    this.color = this.input.options.color;
  }

  save() {
    const obj: any = {};
    obj.status = 'OK';
    obj.data = this.input;
    this.dialogRef.close(obj);
  }

  selectColor(col){
    console.log(col);
    this.input.options.color = col;
  }

}
