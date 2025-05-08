import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, updateProfile, onAuthStateChanged, signOut } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private auth: Auth;

  constructor() {
    this.auth = getAuth();
  }

  async signInUser(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async updateProfileUser(): Promise<void> {
    if (!this.auth.currentUser) {
      throw new Error('No user is currently logged in.');
    }

    try {
      await updateProfile(this.auth.currentUser, {
        displayName: "Jane Q. User"
      });
    } catch (error) {
      throw error;
    }
  }

  async onAuthStateChanged(): Promise<any> {
    try {
      return await new Promise((resolve) => {
        onAuthStateChanged(this.auth, (user) => resolve(user));
      });
    } catch (error) {
      console.error('Auth status error:', error);
      return null;
    }
  }

  async signOutUser(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
  
  // createUser(email: string, password: string): Promise<any> {
  //   return createUserWithEmailAndPassword(this.auth, email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       return user;
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       throw error;
  //     });
  // }

  // signInUser(email: string, password: string): Promise<any> {
  //   return signInWithEmailAndPassword(this.auth, email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       return user;
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       throw error;
  //     });
  // }

  // updateProfileUser(): Promise<void> {
  //   if (this.auth.currentUser) {
  //     return updateProfile(this.auth.currentUser, {
  //       displayName: "Jane Q. User"
  //     });
  //   }
  //   else {
  //     return Promise.reject(new Error('Current no user logged in.'));
  //   }
  // }

  // onAuthStateChanged(): Promise<any> {
  //   return new Promise((resolve) => {
  //     onAuthStateChanged(this.auth, (user) => {
  //       resolve(user);
  //     });
  //   }).then((user) => {
  //     return user;
  //   }).catch((error) => {
  //     console.log('Auth status error:', error);
  //     return null;
  //   });
  // }

  // signOutUser(): Promise<void> {
  //   return signOut(this.auth)
  //     .then(() => {
  //       return;
  //     })
  //     .catch((error) => {
  //       console.log('Sign out error:', error);
  //       return;
  //     });
  // }
}


