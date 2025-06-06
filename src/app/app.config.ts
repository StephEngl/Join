import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth'; /* Required to provide Firebase Authentication support */

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
    providers: [
        /* Provides routing for the application */
        provideRouter(routes),

        /* Initializes Firebase with environment-specific config */
        importProvidersFrom(provideFirebaseApp(() =>
            initializeApp({
                projectId: "join-3324b",
                appId: "1:445334637484:web:3cfea01c4d00e60b298809",
                storageBucket: "join-3324b.firebasestorage.app",
                apiKey: "AIzaSyDVgj9vu_mfnWLJ7-54tVT8WnejpVGJVEU",
                authDomain: "join-3324b.firebaseapp.com",
                messagingSenderId: "445334637484"
            })
        )),

        /* Provides Firestore database access */
        importProvidersFrom(provideFirestore(() => getFirestore())),

        /* Provides Firebase Authentication (required for inject(Auth)) */
        importProvidersFrom(provideAuth(() => getAuth())), /* <-- REQUIRED for SignUpComponent */

        /* Enables animations (noop if disabled) */
        provideAnimationsAsync('noop'),
        provideAnimations(),

        /* Provides Angular Material Dialog globally */
        importProvidersFrom(MatDialogModule)

        /* NOTE: Nothing has been removed from the original setup */
    ]
};
