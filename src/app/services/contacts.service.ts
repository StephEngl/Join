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
  getDoc,
  setDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import { DummyContactsService } from './dummy-contacts.service';

@Injectable({
  providedIn: 'root',
})
export class ContactsService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  dummyContacts = inject(DummyContactsService)
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
    this.checkAndResetIfNeeded();
  }

  ngOnDestroy() {
    if (this.unsubscribeContact) {
      this.unsubscribeContact();
    }
  }

  deleteAllEntries() {
    this.contacts.forEach((contact) => {
      if (contact.id) {
        this.deleteContact(contact.id).then(() => {
        });
      }
    });
  }

  runReset() {
    this.deleteAllEntries();
    this.createDummyEntries();
  }

  async checkAndResetIfNeeded() {
    const currentDate = this.getTodayDateString();
    const docRef = doc(this.firestore, 'timeStamp', 'currentDayStamp');
  
    try {
      const stampSnap = await getDoc(docRef);
      const storedDate = stampSnap.exists() ? stampSnap.data()['currentDay'] : null;
  
      if (storedDate !== currentDate) {
        console.log('detected new Day, resetted Contacts to Dummy Data.');
        await this.runReset();
        await this.updateDayStamp(docRef, currentDate);
      } else {
        console.log('no reset, current Day active.');
      }
    } catch (err) {
      console.error('Error reading current timestamp:', err);
    }
  }
  
  getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
  
  async updateDayStamp(docRef: DocumentReference, date: string) {
    await setDoc(docRef, { currentDay: date });
  }

  createDummyEntries() {
    this.dummyContacts.dummyContacts.forEach((contact) => {
      this.addContact(contact);
    });
  }

  async addContact(
    contact: ContactInterface
  ): Promise<void | DocumentReference> {
    try {
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
        await updateDoc(docRef, this.getCleanJson(contact));
      } catch (err) {
        console.error(err);
      }
    }
  }

  getCleanJson(contact: ContactInterface) {
    return {
      name: contact.name,
      phone: contact.phone,
      mail: contact.mail,
      color: contact.color || this.getRandomColor(),
    };
  }

  subContactsList() {
    const q = query(this.getContactsRef(), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
        this.contacts = [];
        snapshot.forEach((element) => {
          const contact = element.data();
          this.contacts.push(this.setContactObject(element.id, contact));
        });
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

  lastInitial(index: number): string {
    const contact = index != null ? this.contacts[index] : null;
    if (!contact || !contact.name) return '';
    const parts = contact.name.trim().split(' ');
    const lastWord = parts.at(-1) || '';
    return lastWord.charAt(0).toUpperCase();
  }

}
