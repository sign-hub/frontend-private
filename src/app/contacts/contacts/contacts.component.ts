import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'app/share/base.component';
import { Router } from '@angular/router';
import { MdSnackBar, MdDialog } from '@angular/material';
import { ContactsService } from '../contacts.service';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { DeleteContactComponent } from '../delete-contact/delete-contact.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss', '../../share/e-home.scss']
})
export class ContactsComponent extends BaseComponent implements OnInit {
  isLoading: boolean;
  contactIndex: number;
  heightAdmin: string;
  contacts: Array<any>;
  contact: any;

  constructor(protected router: Router,
    protected mdSnackBar: MdSnackBar,
    private contactsService: ContactsService,
    public dialog: MdDialog) {
    super(router, mdSnackBar);
    this.heightAdmin = (this.height - 100) + 'px';
    this.contactIndex = -1;

    if (JSON.parse(localStorage.getItem('userInfo')).role != 'ADMIN') {
      this.router.navigate(['home/profile']);
    }
  }

  ngOnInit() {
    this.loadListContacts();
  }

  loadListContacts() {
    this.isLoading = true;
    this.contactsService.getContacts().subscribe(res => {
      if (res.status === 'OK') {
        this.contacts = res.response;
        if (this.contacts.length > 0) {
          this.contactIndex = 0;
          this.contact = this.contacts[0];
        }
      } else {
        console.error('Server error');
        this.processStatusError(res.errors);
      }
      this.isLoading = false;
    });
  }

  chooseContact(index, contact) {
    this.contactIndex = index;
    this.contact = contact;
    /*if (this.user.deleted) {
      this.isDeleted = true;
    } else {
      this.isDeleted = false;
    }*/
  }

  openDialogUserInfo() {
    const dialogRef = this.dialog.open(ContactDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'OK') {
        this.loadListContacts();
      }
    });
  }

  openDialogUpdateEdit() {
    if (this.contact.uuid) {
      const dialogUpdate = this.dialog.open(ContactDialogComponent, { disableClose: true, data: this.contact });
      dialogUpdate.afterClosed().subscribe(res => {
        if (res === 'OK') {
          this.loadListContacts();
        }
      });
    }
  }

  openDialogDelUser() {
    if (this.contact.uuid) {
      const dialogDelete = this.dialog.open(DeleteContactComponent, { disableClose: true, data: this.contact });
      dialogDelete.afterClosed().subscribe(res => {
        if (res === 'OK') {
          this.loadListContacts();
        }
      });
    }
  }

}
