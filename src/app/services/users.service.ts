import { Injectable, inject, OnDestroy } from '@angular/core';
import { ContactInterface } from '../interfaces/contact.interface';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  DocumentReference,
} from '@angular/fire/firestore';
import { UsersContactsService } from './users-contacts.service';
@Injectable({
  providedIn: 'root'
})
export class UsersService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  usersContactsService = inject(UsersContactsService);
  users: ContactInterface[] = [];

  unsubscribeUser;

  constructor() {
    this.unsubscribeUser = this.subUsersList();
  }

  ngOnDestroy() {
    if (this.unsubscribeUser) {
      this.unsubscribeUser();
    }
  }

  subUsersList() {
    return onSnapshot(this.getUsersRef(), (snapshot) => {
        this.users = [];
        snapshot.forEach((element) => {
          const user = element.data();
          this.users.push(this.usersContactsService.setObjectData(element.id, user));
        });
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  async addUser(uid: string, user: ContactInterface): Promise<void | DocumentReference> {
    try {
      const userWithColor = {
        ...user,
        color: this.usersContactsService.getRandomColor(),
      };
      const userRef = doc(this.getUsersRef(), uid);
      await setDoc(userRef, userWithColor);
      return userRef;
    } catch (err) {
      console.error(err);
    }
  }

    getUsersRef() {
      return collection(this.firestore, 'users');
    }
  
    getSingleUsersRef(docId: string) {
      return doc(collection(this.firestore, 'users'), docId);
    }

    nameInitials(id: string | undefined) {
      const contact = this.users.find(c => c.id === id);
      const parts = contact?.name.trim().split(' ') || [];
      const nameLetter1 = contact?.name.charAt(0).toUpperCase() || '';
      const lastName = parts?.at(-1) || '';
      const lastNameLetter = lastName.charAt(0).toUpperCase();
      return nameLetter1 + lastNameLetter;
    }
  
    contactColor(id: string | undefined) {
      const contact = this.users.find(c => c.id === id);
      return contact?.color;
    }


}
