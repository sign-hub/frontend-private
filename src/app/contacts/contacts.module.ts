import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { SharedModule } from 'app/share/shared.module';
import { ContactsRouting } from './contacts.routing';
import { DeleteContactComponent } from './delete-contact/delete-contact.component';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactsService } from './contacts.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ContactsRouting
  ],
  declarations: [ContactsComponent, DeleteContactComponent, ContactDialogComponent],
  providers: [ContactsService],
  entryComponents: [ContactDialogComponent, DeleteContactComponent]
})
export class ContactsModule { }
