import { Injectable, signal, inject } from '@angular/core';
import { initializeApp } from "firebase/app";
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  updateProfile,
  onAuthStateChanged,
  signOut,
  UserCredential,
  deleteUser
} from "@angular/fire/auth";
import { SignalsService } from './signals.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated = signal<boolean>(false);
  signalService = inject(SignalsService);
  usersService = inject(UsersService);
  activeUserName: string = '';
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

  // await setDoc(doc(this.firestore, 'users', user.uid), {
  //   name: name,
  //   mail: email,
  //   phone: 'no number set',
  //   createdAt: new Date(),
  // });


  async createUser(email: string, password: string, name: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      this.router.navigate(['/login']);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

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

  async updateProfileUser(name: string): Promise<void> {
    if (!this.auth.currentUser) {
      throw new Error('No user is currently logged in.');
    }

    try {
      await updateProfile(this.auth.currentUser, {
        displayName: name
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

  async showActiveUserName() {
    try {
      const user = await this.onAuthStateChanged();
      this.activeUserName = user?.displayName || 'Guest';
    } catch (error) {
      console.error('Error fetching user:', error);
      this.activeUserName = 'Guest';
    }
  }

  activeInitials = signal<string>('');

  async setActiveUserInitials() {
    try {
      const user = await this.onAuthStateChanged();
      const initials = this.displayNameInitials(user?.displayName);
      this.activeInitials.set(initials || 'G');
    } catch (error) {
      console.error('Error:', error);
      this.activeInitials.set('Er');
    }
  }

  displayNameInitials(displayName: string | undefined) {
    if (!displayName) return '';
    const parts = displayName.trim().split(' ');
    const firstLetter = parts[0]?.charAt(0).toUpperCase() || '';
    const lastLetter = parts[parts.length - 1]?.charAt(0).toUpperCase() || '';
    return firstLetter + lastLetter;
  }

  async deleteUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    try {
      await deleteUser(user);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error("Deleting active user failed", error);
    }
  }
  
}


