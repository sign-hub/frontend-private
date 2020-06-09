import { Component, OnInit, Inject } from '@angular/core';
import { BaseComponent } from 'app/share/base.component';
import { Router } from '@angular/router';
import { MdSnackBar, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ContactsService } from '../contacts.service';
import { Select } from '../../share/_model/select';


@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss', '../../share/e-home.scss']
})
export class ContactDialogComponent extends BaseComponent implements OnInit {
  contact: any;
  tools: any[];
  loading: boolean;
  tool: any;

  constructor(protected router: Router,
    protected mdSnackBar: MdSnackBar,
    private contactsService: ContactsService,
    public dialogRef: MdDialogRef<ContactDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { 
      super(router, mdSnackBar);
    }

  ngOnInit() {
    if (this.data) {
      this.contact = this.data;
      console.log(this.contact);
    } else {
      this.contact = {};
    }
    this.initTools();
  }

  initTools() {
    this.tools = [];
    this.tools[0] = new Select('TESTING', 'Testing tool');
    this.tools[1] = new Select('ATLAS', 'Atlas tool');
    this.tools[2] = new Select('GRAMMAR', 'Grammar tool');
    this.tools[3] = new Select('STREAMING', 'Streaming tool');
  }

  save() {
    this.loading = true;
    if (this.contact.userId) {
      this.contactsService.updateContact(this.contact).subscribe(res => {
        if (res.status === 'OK') {
          this.openSnackBar('Updated contact successful!');
          this.dialogRef.close('OK');
        } else {
          this.processStatusError(res.errors);
        }
        this.loading = false;
      });
    } else {
      this.contactsService.createContact(this.contact).subscribe(res => {
        if (res.status === 'OK') {
          this.openSnackBar('Created contact successful!');
          this.dialogRef.close('OK');
        } else {
          this.processStatusError(res.errors);
        }
        this.loading = false;
      });
    }
  }

}
