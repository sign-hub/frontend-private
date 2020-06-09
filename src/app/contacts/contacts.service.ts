import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from 'app/share/base.service';

@Injectable()
export class ContactsService extends BaseService {
  deleteUser(uuid: any) {
    throw new Error("Method not implemented.");
  }

  constructor(protected http: Http) {
    super(http);
   }

  getContacts() {
    return this.requestGet('contact');
  }

  createContact(contact: any) {
    const obj: any = {};
    obj.contact = contact;
    return this.requestPost('contact', obj);
  }

  updateContact(contact: any) {
    const obj: any = {};
    obj.contact = contact;
    return this.requestPost('contact/' + contact.uuid, obj);
  }

  deleteContact(contactUuid: string) {
    return this.requestDelete('contact/' + contactUuid);
  }

}
