import { Routes } from '@angular/router';
import { SummaryComponent } from './main-content/summary/summary.component';
import { ContactsComponent } from './main-content/contacts/contacts.component';
import { HelpComponent } from './main-content/help/help.component';
import { LegalNoticeComponent } from './main-content/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './main-content/privacy-policy/privacy-policy.component';
import { AddTaskComponent } from './main-content/add-task/add-task.component';
import { BoardComponent } from './main-content/board/board.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: 'summary', component: SummaryComponent },
    { path: 'addtask', component: AddTaskComponent },
    { path: 'board', component: BoardComponent },
    { path: 'help', component: HelpComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent }
];
