import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../services/signals.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginDialogComponent, SignUpDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);
  loginLogoHeight: string = "100%";
  loginLogoWidth: string = "100%";
  position: string = "50%";
  loginBackgroundColor: string = "";
  loginLogoImgSrc: string = "./assets/icons/header/logo.svg";
  startAnimationTrigger: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startAnimation();
  }


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
    }, 200);
  }

  toMain() {
    this.authService.login();
  }

  toPrivacyPolicy() {
      this.signalService.dummyAuthStatus.set(true);
      this.router.navigate(['/privacy-policy']);
  }

  toLegalNotice() {
      this.signalService.dummyAuthStatus.set(true);
      this.router.navigate(['/legal-notice']);
  }

  toSignUp() {
      this.signalService.dummyAuthStatus.set(true);
      this.router.navigate(['/sign-up']);
  }
}
