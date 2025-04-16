import { Routes } from '@angular/router';
import { SummaryComponent } from './main-content/summary/summary.component';
import { ContactsComponent } from './main-content/contacts/contacts.component';
import { HelpComponent } from './main-content/help/help.component';
import { LegalNoticeComponent } from './main-content/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './main-content/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path: 'contacts', component: ContactsComponent },
    { path: 'help', component: HelpComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent }
];
