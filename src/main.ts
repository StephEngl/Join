import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/* Bootstraps the application using the standalone Angular setup and custom appConfig */
bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
