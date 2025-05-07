import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../services/signals.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginDialogComponent, SignUpDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  signalService = inject(SignalsService);
  loginLogoHeight: string = "100%";
  loginLogoWidth: string = "100%";
  loginBackgroundColor: string = "";
  loginLogoImgSrc: string = "./assets/icons/header/logo.svg";

  constructor(private router: Router) {}

  toMain() {
    this.signalService.dummyAuthStatus.set(true);
    this.router.navigate(['/summary']);
  }

  ngOnInit() {
    if (this.signalService.isMobile()) {
      this.loginBackgroundColor= "#2A3647";
      this.loginLogoImgSrc = "./assets/icons/header/logo_white.svg";
    } else {
      this.loginBackgroundColor= "#F6F7F8";
    }
    setTimeout(() => {
      this.loginBackgroundColor = 'transparent';
    }, 200);
    setTimeout(() => {
      this.loginLogoHeight = '120px';
      this.loginLogoWidth = "100px";
      this.loginLogoImgSrc = "./assets/icons/header/logo.svg";
    }, 600);
  }
  
  toPrivacyPolicy() {
    this.signalService.dummyAuthStatus.set(true);
    this.router.navigate(['/privacy-policy']);
  }

  toLegalNotice() {
    this.signalService.dummyAuthStatus.set(true);
    this.router.navigate(['/legal-notice']);
  }

}
