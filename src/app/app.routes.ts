import { Routes } from '@angular/router';
import { HelpComponent } from './main-content/help/help.component';
import { LegalNoticeComponent } from './main-content/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './main-content/privacy-policy/privacy-policy.component';
import { AuthGuard } from './services/auth-guard.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'summary',
        loadComponent: () =>
            import('./main-content/summary/summary.component').then(
            (m) => m.SummaryComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'contacts',
        loadComponent: () =>
            import('./main-content/contacts/contacts.component').then(
            (m) => m.ContactsComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'addtask',
        loadComponent: () =>
            import('./main-content/add-task/add-task.component').then(
            (m) => m.AddTaskComponent
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'board',
        loadComponent: () =>
            import('./main-content/board/board.component').then(
            (m) => m.BoardComponent
            ),
        canActivate: [AuthGuard],
    },
    { path: 'help', component: HelpComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    ];
