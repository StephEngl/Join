import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth'; /* Required to provide Firebase Authentication support */

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { environment } from '../environments/environments'

export const appConfig: ApplicationConfig = {
  providers: [
    /* Provides routing for the application */
        provideRouter(routes),

        /* Provides Firestore database access */
        importProvidersFrom(provideFirestore(() => getFirestore())),
        importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebaseConfig))),

        /* Provides Firebase Authentication (required for inject(Auth)) */
        importProvidersFrom(provideAuth(() => getAuth())),

        /* Enables animations (noop if disabled) */
        provideAnimationsAsync('noop'),
        provideAnimations(),

        /* Provides Angular Material Dialog globally */
        importProvidersFrom(MatDialogModule),
  ],
};
