import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { BaseComponent } from '../../../share/base.component';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';
import { TestEditService } from '../_services/testEdit.service';
import { Question, TransitionType } from '../../../models/question';
import { Transition } from '../../../models/transition';
import { User } from '../_model/user';
import { AdminService } from '../../../admin/_service/admin.service';
import { Search } from '../../../admin/_model/search';
import { Select } from '../../../share/_model/select';

declare var require: any;

@Component({
  selector: 'app-config-question-dialog',
  templateUrl: '../_views/configGrammar.component.html',
  styleUrls: ['../_views/configGrammar.component.scss', '../../../share/base.scss']
})
export class ConfigGrammarComponent extends BaseComponent implements OnInit {
  loadingUpdate: boolean;
  question: Question;
  isLoading: boolean;
  transition: Transition;
  users: Array<User>;
  name = 'name';
  user: User;
  search: Search;
  editors: any;
  contentProviders: any;
  roles: Array<Select>;

  constructor(public mdSnackBar: MdSnackBar,
    protected router: Router,
    public dialogRef: MdDialogRef<ConfigGrammarComponent>,
    private adminService: AdminService,
    private testEditService: TestEditService,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
    this.editors = this.data.grammar.editors;
    this.contentProviders = this.data.grammar.contentProviders;
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.search = new Search();
    this.initRole();
    this.loadListUser(null, null, null);
  }
  initRole() {
    this.roles = [];
    this.roles[0] = new Select('ADMIN', 'Administrator');
    this.roles[1] = new Select('GR_CON_PRO', 'Content provider');
    this.roles[2] = new Select('GRAMMAR_ADMIN', 'Grammar Administrator');
  }
  loadListUser(role: string, email: string, name: string) {
    this.isLoading = true;
    this.adminService.getUsers(role, email, name).subscribe(res => {
      if (res.status === 'OK') {
        this.users = res.response;
        if (this.users.length > 0) {
          this.user = this.users[0];
          this.users.forEach((element, index) => {
            if (this.editors.indexOf(element.userId) >= 0) {
              this.users[index].editor = true;
            } else {
              this.users[index].editor = false;
            }
            if (this.contentProviders.indexOf(element.userId) >= 0) {
              this.users[index].contentProvider = true;
            } else {
              this.users[index].contentProvider = false;
            }
          });
        }
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.isLoading = false;
    });
  }

  filterListUser() {
    this.loadListUser(this.search.role, this.search.email, this.search.name);
  }

  chooseEditor(i, user) {
    const index = this.data.grammar.editors.indexOf(user.userId);
    if (index > -1) {
      this.data.grammar.editors.splice(index, 1);
      this.editorUpdate(i, true);
    } else {
      this.data.grammar.editors.push(user.userId);
      this.editorUpdate(i, false);
    }
  }

  chooseContentProvider(i, user) {
    const index = this.data.grammar.contentProviders.indexOf(user.userId);
    if (index > -1) {
      this.data.grammar.contentProviders.splice(index, 1);
      this.contentProviderUpdate(i, true);
    } else {
      this.data.grammar.contentProviders.push(user.userId);
      this.contentProviderUpdate(i, false);
    }
  }

  editorUpdate(i: string, status) {
    this.isLoading = true;
    if (!!this.data.grammar.type && this.data.grammar.type === 'PART') {
      this.testEditService.requestUpdateGrammarPart(this.data.grammar.uuid, this.data.grammar).subscribe(res => {
        if (res.status === 'OK') {

        } else {
          this.users[i].editor = status;
          console.error('Server error');
          this.processStatusError(res.errors);
        }
        this.isLoading = false;
      });
    } else {
      this.testEditService.requestUpdateGrammar(this.data.grammar.uuid, this.data.grammar).subscribe(res => {
        if (res.status === 'OK') {

        } else {
          this.users[i].editor = status;
          console.error('Server error');
          this.processStatusError(res.errors);
        }
        this.isLoading = false;
      });
    }
  }
  contentProviderUpdate(i: string, status) {
    this.isLoading = true;
    if (!!this.data.grammar.type && this.data.grammar.type === 'PART') {
      this.testEditService.requestUpdateGrammarPart(this.data.grammar.uuid, this.data.grammar).subscribe(res => {
        if (res.status === 'OK') {

        } else {
          this.users[i].contentProvider = status;
          console.error('Server error');
          this.processStatusError(res.errors);
        }
        this.isLoading = false;
      });
    } else {
      this.testEditService.requestUpdateGrammar(this.data.grammar.uuid, this.data.grammar).subscribe(res => {
        if (res.status === 'OK') {

        } else {
          this.users[i].contentProvider = status;
          console.error('Server error');
          this.processStatusError(res.errors);
        }
        this.isLoading = false;
      });
    }
  }
}
