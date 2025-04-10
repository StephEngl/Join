import { Injectable, inject } from '@angular/core';
import { ContactInterface } from '../interfaces/contact-interface';
import { Firestore, collection, doc, onSnapshot, collectionData, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  contacts: ContactInterface[] = [];
  firestore: Firestore = inject(Firestore);
  unsubContact;

  constructor() { 

    this.unsubContact = onSnapshot(this.getContactsRef(), (list)=> {
      this.contacts = [];
      list.forEach((doc) => {
        // this.contacts.push(doc);
        console.log(doc);
      })
    });


  } // constructor end

  ngOnDestroy() {
    this.unsubContact();
  }

  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }
}

