import { Injectable, inject, OnDestroy } from '@angular/core';
import { ContactInterface } from '../interfaces/contact.interface';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  DocumentReference,
} from '@angular/fire/firestore';
import { UsersContactsService } from './users-contacts.service';

@Injectable({
  providedIn: 'root',
})
export class ContactsService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  usersContactsService = inject(UsersContactsService);
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

  ngOnDestroy() {
    if (this.unsubscribeContact) {
      this.unsubscribeContact();
    }
  }

  async addContact(
    contact: ContactInterface
  ): Promise<void | DocumentReference> {
    try {
      const contactWithColor = {
        ...contact,
        color: this.usersContactsService.getRandomColor(),
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

  async updateContact(contact: ContactInterface) {
    if (contact.id) {
      try {
        let docRef = this.getSingleDocRef(contact.id);
        await updateDoc(docRef, this.usersContactsService.getCleanJson(contact));
      } catch (err) {
        console.error(err);
      }
    }
  }

  subContactsList() {
    const q = query(this.getContactsRef(), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
        this.contacts = [];
        snapshot.forEach((element) => {
          const contact = element.data();
          this.contacts.push(this.usersContactsService.setObjectData(element.id, contact));
        });
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }

  getSingleDocRef(docId: string) {
    return doc(collection(this.firestore, 'contacts'), docId);
  }

  // move to user-contacts.service
  lastInitial(index: number): string {
    const contact = index != null ? this.contacts[index] : null;
    if (!contact || !contact.name) return '';
    const parts = contact.name.trim().split(' ');
    const lastWord = parts.at(-1) || '';
    return lastWord.charAt(0).toUpperCase();
  }

  nameInitials(id: string | undefined) {
    const contact = this.contacts.find(c => c.id === id);
    const parts = contact?.name.trim().split(' ') || [];
    const nameLetter1 = contact?.name.charAt(0).toUpperCase() || '';
    const lastName = parts?.at(-1) || '';
    const lastNameLetter = lastName.charAt(0).toUpperCase();
    return nameLetter1 + lastNameLetter;
  }

  contactColor(id: string | undefined) {
    const contact = this.contacts.find(c => c.id === id);
    return contact?.color;
  }
  
  contactName(id: string | undefined) {
    const contact = this.contacts.find(c => c.id === id);
    return contact?.name;
  }

}
