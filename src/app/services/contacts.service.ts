import { Injectable, inject } from '@angular/core';
import { ContactInterface } from '../interfaces/contact-interface';
import { Firestore, collection, doc, onSnapshot, collectionData, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  contacts: ContactInterface[] = [];
  unsubContact;
  firestore: Firestore = inject(Firestore);

  constructor() { 

    this.unsubContact = onSnapshot(this.getContactsRef(), (list)=> {
      list.forEach((doc) => {
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

