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
  getDocs,
  query,
  where,
  orderBy,
  limit,
  DocumentReference,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContactsService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  contacts: ContactInterface[] = [];
  contactColors: string[] = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#e4b300',
    '#0038FF',
    '#6ed81c',
    '#b7a202',
    '#FF4646',
    '#FFBB2B',
  ];
  unsubscribeContact;

  constructor() {
    this.unsubscribeContact = this.subContactsList();
  }
  // constructor end

  ngOnDestroy() {
    if (this.unsubscribeContact) {
      this.unsubscribeContact();
    }
  }

  async addContact(
    contact: ContactInterface
  ): Promise<void | DocumentReference> {
    try {
      // add random color
      const contactWithColor = {
        ...contact,
        color: this.getRandomColor(),
      };
      const contactRef = await addDoc(this.getContactsRef(), contactWithColor);
      return contactRef;
    } catch (err) {
      console.error(err);
    }
  }

  async deleteContact(docId: string) {
    try {
      await deleteDoc(this.getSingleDocRef(docId));
    } catch (err) {
      console.error(err);
    }
  }

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.contactColors.length);
    return this.contactColors[randomIndex];
  }

  async updateContact(contact: ContactInterface) {
    if (contact.id) {
      try {
        let docRef = this.getSingleDocRef(contact.id);
        console.log(docRef);
        
        await updateDoc(docRef, this.getCleanJson(contact));
      } catch (err) {
        console.error(err);
      }
    }
  }

  getCleanJson(contact: ContactInterface) {
    return {
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      mail: contact.mail,
      color: contact.color || this.getRandomColor(),
    };
  }

  subContactsList() {
    const q = query(this.getContactsRef(), orderBy('name'));
    return onSnapshot(
      q,
      (snapshot) => {
        this.contacts = [];
        snapshot.forEach((element) => {
          const contact = element.data();
          this.contacts.push(this.setContactObject(element.id, contact));
        });
        console.log(this.contacts);
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  setContactObject(id:string, obj: any): ContactInterface {
    return {
      id: id,
      name: obj.name || '',
      phone: obj.phone || '',
      mail: obj.mail || '',
      color: obj.color || this.getRandomColor(),
    };
  }

  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }

  getSingleDocRef(docId: string) {
    return doc(collection(this.firestore, 'contacts'), docId);
  }
}
