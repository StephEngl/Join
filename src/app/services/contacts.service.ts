import { Injectable, inject, OnDestroy } from '@angular/core';
import { getAuth } from "@angular/fire/auth"; 
import { ContactInterface } from '../interfaces/contact.interface';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import { UsersContactsService } from './users-contacts.service';
import { UsersService } from './users.service';
import { AuthenticationService } from './authentication.service';
import { TasksService } from './tasks.service';

/**
 * Service for managing contacts in the Firestore database.
 * Provides methods to add, delete, update, and retrieve contacts. 
 * Additionally, it allows for subscribing to changes in the contacts list.
 * @remarks
 * This service interacts with Firestore to fetch, update, and delete contact data. 
 * It also manages the contact list and ensures the user can only edit their own contacts.
 */
@Injectable({
  providedIn: 'root',
})
export class ContactsService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  usersContactsService = inject(UsersContactsService);
  usersService = inject(UsersService);
  authService = inject(AuthenticationService);
  tasksService = inject(TasksService);
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

   /** Unsubscribe function for the contact list subscription. */
  unsubscribeContact;

  constructor() {
    this.unsubscribeContact = this.subContactsList();
  }

  /**
   * Unsubscribes from the contacts list when the service is destroyed.
   */
  ngOnDestroy() {
    if (this.unsubscribeContact) {
      this.unsubscribeContact();
    }
  }

  /**
   * Adds a new contact to Firestore.
   * @param contact - The contact object to add.
   * @returns A Promise that resolves to a DocumentReference if the contact is added successfully.
   */
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

  /**
   * Checks if the current user can edit or delete a contact.
   * @param docId - The document ID of the contact.
   * @returns True if the current user is authorized to edit or delete the contact, otherwise false.
   */
  canEditOrDeleteContact(docId: string): boolean {
    const user = getAuth().currentUser;
    if (!user || !docId) return false;
  
    const userExists = this.usersService.users.some(user => user.id === docId);
    if (userExists && user.uid !== docId) {
      return false;
    }
    return true;
  }

  /**
   * Deletes a contact from Firestore. Checks wether contact is from collection user or contacts.
   * @param docId - The document ID of the contact to delete.
   */
  async deleteContact(docId: string) {
    if (!this.canEditOrDeleteContact(docId)) return;
    const userExists = this.usersService.users.some(user => user.id === docId);
    const docRef = userExists ? this.usersService.getSingleUsersRef(docId) : this.getSingleDocRef(docId); 
  
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

  /**
   * Updates a contact's information in Firestore.Checks wether contact is from collection user or contacts.
   * @param contact - The updated contact object.
   */
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

  /**
   * Subscribes to the Firestore contacts collection and updates the contacts list in real-time.
   */
  subContactsList() {
    return onSnapshot(this.getContactsRef(), (snapshot) => {
      const firestoreContacts: ContactInterface[] = [];
      snapshot.forEach((element) => {
        const contact = element.data();
        firestoreContacts.push(this.usersContactsService.setObjectData(element.id, contact));
      });
      const uniqueList = [...firestoreContacts, ...this.usersService.users]
        .filter((value, index, self) => index === self.findIndex((t) => t.id === value.id));
  
      this.sortUniqueList(uniqueList);
    },
    (error) => {
      console.error('Firestore Error', error.message);
    });
  }

  /**
   * Loads all contacts from Firestore.
   * @returns A Promise that resolves once the contacts are loaded and sorted.
   */
  async loadContacts(): Promise<void> {
    try {
      const snapshot = await getDocs(this.getContactsRef());
      const contacts: ContactInterface[] = [];
  
      snapshot.forEach((docSnap) => {
        const contact = docSnap.data();
        contacts.push(this.usersContactsService.setObjectData(docSnap.id, contact));
      });
      const combinedList = [...contacts, ...this.usersService.users];
      const uniqueList = combinedList.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id));
      this.sortUniqueList(uniqueList);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  /**
   * Sorts the contact list by name.
   * @param array - The list of contacts to be sorted.
   */
  sortUniqueList(array: ContactInterface[]) {
    this.contacts = array.sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    );
  }

  /**
   * Retrieves the Firestore reference for the contacts collection.
   * @returns The Firestore collection reference for contacts.
   */
  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }

  /**
   * Retrieves a Firestore document reference for a specific contact.
   * @param docId - The document ID of the contact.
   * @returns The Firestore document reference for the contact.
   */
  getSingleDocRef(docId: string) {
    return doc(collection(this.firestore, 'contacts'), docId);
  }

  /**
   * Gets the last initial of a contact's name.
   * @param index - The index of the contact in the contacts list.
   * @returns The first letter of the last name of the contact.
   */
  lastInitial(index: number): string {
    const contact = index != null ? this.contacts[index] : null;
    if (!contact || !contact.name) return '';
    const parts = contact.name.trim().split(' ');
    const lastWord = parts.at(-1) || '';
    return lastWord.charAt(0).toUpperCase();
  }

  /**
   * Gets the initials of a contact's name (first and last).
   * @param id - The ID of the contact.
   * @returns The initials of the contact's name.
   */
  nameInitials(id: string | undefined) {
    const contact = this.contacts.find(c => c.id === id);
    const parts = contact?.name.trim().split(' ') || [];
    const nameLetter1 = contact?.name.charAt(0).toUpperCase() || '';
    const lastName = parts?.at(-1) || '';
    const lastNameLetter = lastName.charAt(0).toUpperCase();
    return nameLetter1 + lastNameLetter;
  }

  /**
   * Gets the contact color associated with a contact.
   * @param id - The ID of the contact.
   * @returns The color associated with the contact.
   */
  contactColor(id: string | undefined) {
    const contact = this.contacts.find(c => c.id === id);
    return contact?.color;
  }
  
  /**
   * Gets the contact name for a given ID.
   * @param id - The ID of the contact.
   * @returns The name of the contact.
   */
  contactName(id: string | undefined) {
    const contact = this.contacts.find(c => c.id === id);
    return contact?.name;
  }

}
