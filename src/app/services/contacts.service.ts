import { Injectable, inject } from '@angular/core';
import { ContactInterface } from '../interfaces/contact.interface';
import { Firestore, collection, doc, onSnapshot, collectionData, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  firestore: Firestore = inject(Firestore);
  contacts: ContactInterface[] = [];
  unsubContact;

  constructor() { 

    this.unsubContact = onSnapshot(
      this.getContactsRef(),
      (snapshot) => {
        console.log(`${snapshot.size} Alle Kontakte geladen:`);
    
        snapshot.forEach((doc) => {
          const contact = doc.data();
          console.log('Kontakt:', contact);
        });
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
    

    console.log("test");
    


  } // constructor end

  ngOnDestroy() {
    this.unsubContact();
  }

  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }
}

