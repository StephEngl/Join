import { Injectable, inject, OnDestroy } from '@angular/core';
import { getAuth } from "@angular/fire/auth"; 
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
import { UsersService } from './users.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ContactsService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  usersContactsService = inject(UsersContactsService);
  usersService = inject(UsersService);
  authService = inject(AuthenticationService);
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

  canEditOrDeleteContact(docId: string): boolean {
    const user = getAuth().currentUser;
    if (!user || !docId) return false;
  
    const userExists = this.usersService.users.some(user => user.id === docId);
    if (userExists && user.uid !== docId) {
      return false;
    }
    return true;
  }

  async deleteContact(docId: string) {
    if (!this.canEditOrDeleteContact(docId)) return;
    const userExists = this.usersService.users.some(user => user.id === docId);
    const docRef = userExists
      ? this.usersService.getSingleUsersRef(docId) 
      : this.getSingleDocRef(docId); 
  
    try {
      await deleteDoc(docRef);
      const user = getAuth().currentUser;
      if (user && user.uid === docId) {
        await this.authService.deleteUser();
      }
    } catch (err) {
      console.error("Deleting failed", err);
    }
  }

  async updateContact(contact: ContactInterface) {
  if (!contact.id || !this.canEditOrDeleteContact(contact.id)) return;
    const userExists = this.usersService.users.some(user => user.id === contact.id);
    const docRef = userExists
      ? this.usersService.getSingleUsersRef(contact.id) 
      : this.getSingleDocRef(contact.id);  
  
    try {
      await updateDoc(docRef, this.usersContactsService.getCleanJson(contact));
    } catch (err) {
      console.error("Error during update:", err);
    }
  }

  subContactsList() {
    return onSnapshot(this.getContactsRef(), (snapshot) => {
        this.contacts = [];
        snapshot.forEach((element) => {
          const contact = element.data();
          this.contacts.push(this.usersContactsService.setObjectData(element.id, contact));
          const uniqueList = [...this.contacts, ...this.usersService.users]
          .filter((value, index, self) => index === self.findIndex((t) => t.id === value.id));
          this.sortUniqueList(uniqueList)
          
        });
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  sortUniqueList(array: ContactInterface[]) {
    this.contacts = array.sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    );
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
