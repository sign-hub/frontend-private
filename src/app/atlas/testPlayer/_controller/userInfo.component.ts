import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';
import { TestPlayerService } from '../_services/testPlayer.service';
import { Subject } from 'rxjs';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-dialog-input-field',
  templateUrl: '../_views/userInfo.component.html',
  styleUrls: ['../_views/userInfo.component.scss', '../../../share/base.scss']
})
export class UserInfoComponent extends BaseComponent implements OnInit, OnDestroy {
  input: any;
  public languages = [];
  public selectedLanguage;
  private _unsubscribeAll: Subject<any>;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    private testPlayerService: TestPlayerService,
    public dialogRef: MdDialogRef<UserInfoComponent>,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this._unsubscribeAll = new Subject();
    this.input = this.data;

  }
  ngOnInit(): void {
    this.cdr.detectChanges();
    this.testPlayerService.requestGetLanguages()
      .takeUntil(this._unsubscribeAll)
      .subscribe((res) => {
        this.languages = res.sort((a: any, b: any) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }

          // names must be equal
          return 0;
        });
        this.languages.unshift({ 'code': this.input.otherlanguageCode, 'name': 'Other' });
      });
    if (this.data.hasOwnProperty('language')) {
      this.input.otherlanguageCode = this.data.language.code;
      this.selectedLanguage = this.data.language.name;
    }
    else {
      this.selectedLanguage = 'Other';
    }
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    // Make sure previous input is remove
    this.input = null;
    this.data = null;
  }


  save() {
    if (this.isNil('name') || this.isNil('surname') || (this.selectedLanguage === 'Other' && this.isNil('otherlanguageCode'))) {
      // this.isNil('age') || this.isNil('gender') * / ) {
      return;
    }
    const obj: any = {};
    obj.status = 'OK';
    if (this.input.language === undefined || this.selectedLanguage === 'Other') {
      this.input.language = Object.assign({}, { 'code': this.input.otherlanguageCode, 'name': 'Other' });
    }
    delete this.input.otherlanguageCode;
    obj.data = this.input;
    this.dialogRef.close(obj);
    console.log(obj);
  }

  setLanguage(value) {
    if (value == 'Other') {
      this.selectedLanguage = value;
      this.input.language = Object.assign({}, { name: 'Other', code: this.input.otherlanguageCode });
    } else {
      console.log(value);
      this.languages.forEach((language, index) => {
        if (value == language.name) {
          this.selectedLanguage = value;
          this.input.language = this.languages[index];
          console.log(this.input);
        }
      });
    }
    /*if(value.code == ''){
      JSON.parse(value);
      this.selectedLanguage = !!this.selectedLanguage ? this.selectedLanguage : value.code;
      this.input.language = Object.assign({},{name:'Other' , code : '' });
    }else{
      JSON.parse(value);
      this.selectedLanguage = null;
      console.log(!!this.selectedLanguage);
      this.input.language = value;
    }*/
  }


  isNil(field): boolean {
    if (field === undefined || field === null) {
      return true;
    }
    if (this.input[field] === undefined || this.input[field] === null) {
      return true;
    }
    if (typeof this.input[field] === 'string') {
      if (this.input[field].trim() === '') {
        return true;
      }
    }
    return false;
  }

  changeTransition() {
    this.input.transition = !this.input.transition;
  }

}
