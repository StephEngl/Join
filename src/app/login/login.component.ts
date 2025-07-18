import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../services/signals.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { ContactsService } from '../services/contacts.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [LoginDialogComponent, SignUpDialogComponent, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})

/**
 * LoginComponent provides the login and registration entry point of the application.
 * Handles routing to legal pages, logo animations, and switching between login and sign-up views.
*/
export class LoginComponent {

    signalService = inject(SignalsService);
    authService = inject(AuthenticationService);
    usersService = inject(UsersService);
    contactsService = inject(ContactsService);
    loginLogoHeight: string = "100%";
    loginLogoWidth: string = "100%";
    position: string = "50%";
    loginBackgroundColor: string = "";
    loginLogoImgSrc: string = "./assets/icons/header/logo.svg";
    startAnimationTrigger: boolean = false;

    /* Controls visibility of sign-up dialog */
    showSignUpDialog: boolean = false;

    constructor(private router: Router) { }

    /** Triggers the intro animation and logo adjustments for mobile or desktop. */
    ngOnInit() {
        this.startAnimation();
        this.signalService.signingIn.set(true);
    }

    /** Starts the login screen animation sequence. */
    startAnimation() {
        if (this.signalService.isMobile()) {
            this.loginBackgroundColor = "#2A3647";
            this.loginLogoImgSrc = "./assets/icons/header/logo_white.svg";
        } else {
            this.loginBackgroundColor = "#F6F7F8";
        }
        setTimeout(() => {
            this.loginLogoImgSrc = "./assets/icons/header/logo.svg";
            this.loginBackgroundColor = "transparent";
            this.startAnimationTrigger = true;
        }, 400);
    }

    /** Navigates to the privacy policy page. */
    toPrivacyPolicy() {
        this.signalService.hideHrefs.set(true);
        this.router.navigate(['/privacy-policy']);
    }

    /** Navigates to the legal notice page. */
    toLegalNotice() {
        this.signalService.hideHrefs.set(true);
        this.router.navigate(['/legal-notice']);
    }

    /* Opens the sign-up dialog inline (replaces app-login-dialog via @if) */
    toSignUpDialog() {
        this.signalService.hideHrefs.set(false);
        this.showSignUpDialog = true;
    }

    /* Returns from sign-up to login dialog */
    toLogin() {
        this.showSignUpDialog = false;
    }

    /* Called from dialog when sign-up was successful */
    onSignUpSuccess() {
        alert('Sign up was successful'); 
        this.toLogin();
    }
}
