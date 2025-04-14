import { Routes } from '@angular/router';
import { SummaryComponent } from './main_content/summary/summary.component';
import { ContactsComponent } from './main_content/contacts/contacts.component';
import { HelpComponent } from './main_content/help/help.component';
import { LegalNoticeComponent } from './main_content/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './main_content/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path: '', component: ContactsComponent },
    { path: 'help', component: HelpComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent }
];
