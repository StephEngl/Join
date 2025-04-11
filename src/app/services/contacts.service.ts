import { Injectable, inject, OnDestroy } from '@angular/core';
import { ContactInterface } from '../interfaces/contact.interface';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContactsService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  contacts: ContactInterface[] = [];
  unsubscribeContact;

  constructor() {
    this.unsubscribeContact = this.subContactsList();
  } // constructor end

  ngOnDestroy() {
    if (this.unsubscribeContact) {
      this.unsubscribeContact();
    }
  }

  subContactsList() {
    const q = query(this.getContactsRef(), orderBy('name'));
    return onSnapshot(
      q,
      (snapshot) => {
        snapshot.forEach((element) => {
          const contact = element.data();
          this.contacts.push(this.setContactObject(contact));
        });
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  setContactObject(obj: any): ContactInterface {
    return {
      name: obj.name || '',
      phone: obj.phone || '',
      mail: obj.mail || '',
    };
  }

  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }
}
