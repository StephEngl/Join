import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, updateProfile } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private auth: Auth;

  constructor() {
    this.auth = getAuth();
  }

  createUser(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Erfolgreich registriert
        const user = userCredential.user;
        // Hier kannst du weitere Aktionen durchführen
        return user;
      })
      .catch((error) => {
        // Fehlerbehandlung
        const errorCode = error.code;
        const errorMessage = error.message;
        // Fehler ggf. weiterwerfen oder behandeln
        throw error;
      });
  }

  signInUser(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Erfolgreich registriert
        const user = userCredential.user;
        // Hier kannst du weitere Aktionen durchführen
        return user;
      })
      .catch((error) => {
        // Fehlerbehandlung
        const errorCode = error.code;
        const errorMessage = error.message;
        // Fehler ggf. weiterwerfen oder behandeln
        throw error;
      });
  }

  updateProfileUser(displayName: string): Promise<void> {
    if (this.auth.currentUser) {
      return updateProfile(this.auth.currentUser, {
        displayName: "Jane Q. User"
      });
    }
    else {
      return Promise.reject(new Error('Current no user logged in.'));
    }
  }


}


