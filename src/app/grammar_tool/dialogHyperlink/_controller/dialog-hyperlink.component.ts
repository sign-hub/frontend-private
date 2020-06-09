import { Subject } from 'rxjs';
import { Grammar } from './../../testedit/_model/grammar';
import { TestEditService } from './../../testedit/_services/testEdit.service';
import { Component, OnInit, Inject, SimpleChanges } from '@angular/core';
import { MdSnackBar, MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { MdDialog } from '@angular/material';





@Component({
  selector: 'app-dialog-hyperlink',
  templateUrl: '../_views/dialog-hyperlink.component.html',
  styleUrls: ['../_views/dialog-hyperlink.component.scss']
})
export class DialogHyperlinkComponent implements OnInit {

  grammar: any;
  inputText: any;
  uuid: any;
  selectedText: string;

  constructor(
    public dialog: MdDialog,
    public mdSnackBar: MdSnackBar,
    public testEditService: TestEditService,
    public dialogRef: MdDialogRef<DialogHyperlinkComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    this.selectedText = data;
    this.grammar = this.testEditService.getCurrentGrammar();
  }

  ngOnInit() {
    this.inputText = document.getElementById('anchor');
  }

  hasChild(c) {
    if (c.parts.length > 0) {
      return true;
    }
  }

  rotate(event) {
    const target: any = event.target;
    if (target.parentNode.classList.contains('active')) {
      if (target.textContent === 'keyboard_arrow_down') {
        target.textContent = 'keyboard_arrow_right';
        target.parentNode.classList.remove('active');
      }
    } else {
      target.parentNode.classList.add('active');
      target.textContent = 'keyboard_arrow_down';
    }
  }

  setTextInput(uuid, name) {
    if (this.inputText.value !== '') {
      name = this.inputText.value;
    }
    if (this.selectedText === '') {
      this.inputText.value = name;
      this.uuid = uuid;
    } else {
      this.inputText.value = this.selectedText;
      this.uuid = uuid;
    }
  }

  save() {
    const obj: any = {};
    if (this.uuid && this.inputText.value) {
      obj.status = 'OK';
      obj.uuid = this.uuid;
      obj.name = this.inputText.value;
    }
    this.dialogRef.close(obj);
  }
}
