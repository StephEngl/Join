import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"join-3324b","appId":"1:445334637484:web:3cfea01c4d00e60b298809","storageBucket":"join-3324b.firebasestorage.app","apiKey":"AIzaSyDVgj9vu_mfnWLJ7-54tVT8WnejpVGJVEU","authDomain":"join-3324b.firebaseapp.com","messagingSenderId":"445334637484"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
