import { Injectable, signal, inject } from '@angular/core';
import { initializeApp } from "firebase/app";
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, updateProfile, onAuthStateChanged, signOut } from "@angular/fire/auth";
import { SignalsService } from './signals.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated = signal<boolean>(false);
  signalService = inject(SignalsService);
  private auth: Auth;

  constructor(private router: Router) {
    this.auth = getAuth();
    this.checkAuthStatus(); 
  }

  // start test functions
  login(): void {
    this.isAuthenticated.set(true);
    this.router.navigate(['/summary']);
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
  // end test functions

  async signInUser(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/summary']);
      this.isAuthenticated.set(true);
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
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
      this.signalService.hideHrefs.set(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  checkAuthStatus() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isAuthenticated.set(true); 
        this.router.navigate(['/summary']); // after refresh to summary
      } else {
        this.isAuthenticated.set(false);
      }
    });
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


