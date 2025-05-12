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

/**
 * Provides authentication functionality using Firebase Auth. This includes creating users, signing users in and out,
 * updating user profiles, and managing the authentication state. The service also manages the current user's session
 * and provides reactive signals for tracking login state and active user initials.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated = signal<boolean>(false);
  activeInitials = signal<string>('');
  signalService = inject(SignalsService);
  usersService = inject(UsersService);
  activeUserName: string = '';
  private auth: Auth;

  constructor(private router: Router) {
    this.auth = getAuth();
    this.checkAuthStatus(); 
  }


  /**
   * Returns whether the user is currently authenticated.
   * @returns {boolean} True if the user is authenticated, otherwise false.
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Creates a new user account with the provided email, password, and name.
   * @param email The email of the new user.
   * @param password The password of the new user.
   * @param name The name of the new user.
   * @returns {Promise<UserCredential>} The user credential returned by Firebase after user creation.
   * @throws {Error} Throws an error if the user creation fails.
   */
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

  /**
   * Signs in a user with the provided email and password.
   * @param email The email of the user.
   * @param password The password of the user.
   * @returns {Promise<any>} The user object after successful sign-in.
   * @throws {Error} Throws an error if the sign-in fails.
   */
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

  /**
   * Updates the profile of the currently authenticated user with the new name.
   * @param name The new name to set for the user.
   * @returns {Promise<void>} Resolves when the profile update is complete.
   * @throws {Error} Throws an error if the profile update fails.
   */
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

  /**
   * Observes the authentication state and returns the current user (if authenticated).
   * @returns {Promise<any>} A promise resolving to the user object or null if not authenticated.
   * @throws {Error} Throws an error if there's an issue while checking authentication state.
   */
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

  /**
   * Signs out the currently authenticated user and redirects to the login page.
   * @returns {Promise<void>} Resolves when the user has been signed out.
   * @throws {Error} Throws an error if the sign-out process fails.
   */
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

  /**
   * Checks the current authentication status and navigates to
   * the appropriate page based on the user's state.
   */
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

  /**
   * Fetches the active user's name from the authentication state.
   * @returns {Promise<void>} Resolves when the user's name has been retrieved.
   */
  async showActiveUserName() {
    try {
      const user = await this.onAuthStateChanged();
      this.activeUserName = user?.displayName || 'Guest';
    } catch (error) {
      console.error('Error fetching user:', error);
      this.activeUserName = 'Guest';
    }
  }

  /**
   * Sets the initials of the active user based on their display name.
   * @returns {Promise<void>} Resolves when the user's initials have been set.
   */
  async setActiveUserInitials() {
    try {
      const user = await this.onAuthStateChanged();
      const initials = this.displayNameInitials(user?.displayName);
      this.activeInitials.set(initials);
    } catch (error) {
      console.error('Error:', error);
      this.activeInitials.set('Er');
    }
  }

  /**
   * Extracts and formats the initials from a user's display name.
   * @param displayName The full display name of the user.
   * @returns {string} The formatted initials.
   */
  displayNameInitials(displayName: string | undefined) {
    if (!displayName) return '';
    const parts = displayName.trim().split(' ');
    const firstLetter = parts[0]?.charAt(0).toUpperCase() || '';
    const lastLetter = parts[parts.length - 1]?.charAt(0).toUpperCase() || '';
    return firstLetter + lastLetter;
  }

  /**
   * Deletes the currently authenticated user account.
   * @returns {Promise<void>} Resolves when the user account has been deleted.
   * @throws {Error} Throws an error if deleting the user fails.
   */
  async deleteUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    try {
      await deleteUser(user);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']).then(() => location.reload());
    } catch (error) {
      console.error("Deleting active user failed", error);
    }
  }
}


