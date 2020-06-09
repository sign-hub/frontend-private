import { Component, OnInit, Inject } from '@angular/core';
import { BaseComponent } from 'app/share/base.component';
import { Router } from '@angular/router';
import { MdSnackBar, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-delete-contact',
  templateUrl: './delete-contact.component.html',
  styleUrls: ['./delete-contact.component.scss']
})
export class DeleteContactComponent extends BaseComponent implements OnInit {
  contact: any;
  loading: boolean;

  constructor(protected router: Router,
    protected mdSnackBar: MdSnackBar,
    private contactsService: ContactsService,
    public dialogRef: MdDialogRef<DeleteContactComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    super(router, mdSnackBar);
   }

  ngOnInit() {
 
    this.contact = this.data;
  }
  deleteContact() {
    this.loading = true;
    this.contactsService.deleteContact(this.contact.uuid).subscribe(res => {
      if (res.status === 'OK') {
        this.openSnackBar('Delete contact successful!');
        this.dialogRef.close('OK');
      } else {
        this.processStatusError(res.errors);
      }
      this.loading = false;
    });
  }

}
