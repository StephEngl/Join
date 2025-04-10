import { Routes } from '@angular/router';
import { SummaryComponent } from './main_content/summary/summary.component';
import { ContactsComponent } from './main_content/contacts/contacts.component';

export const routes: Routes = [
    { path: '', component: ContactsComponent }
];
