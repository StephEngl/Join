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
  providedIn: 'root'
})
export class UsersService {
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

  async addUser(user: ContactInterface): Promise<void | DocumentReference> {
    try {
      const userWithColor = {
        ...user,
        color: this.usersContactsService.getRandomColor(),
      };
      const contactRef = await addDoc(this.getUsersRef(), userWithColor);
      return contactRef;
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


}
