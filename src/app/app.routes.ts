import { Routes } from '@angular/router';
import { SummaryComponent } from './main-content/summary/summary.component';
import { ContactsComponent } from './main-content/contacts/contacts.component';
import { HelpComponent } from './main-content/help/help.component';
import { LegalNoticeComponent } from './main-content/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './main-content/privacy-policy/privacy-policy.component';
import { AddTaskComponent } from './main-content/add-task/add-task.component';
import { BoardComponent } from './main-content/board/board.component';
import { LoginComponent } from './login/login.component';
import { SignUpDialogComponent } from './login/sign-up-dialog/sign-up-dialog.component';
import { AuthGuard } from './services/auth-guard.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./login/login.component').then((m) => m.LoginComponent),
    },
    // {
    //     path: 'sign-up',
    //     loadComponent: () =>
    //         import('./login/sign-up-dialog/sign-up-dialog.component').then(
    //         (m) => m.SignUpDialogComponent
    //         ),
    // },
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
