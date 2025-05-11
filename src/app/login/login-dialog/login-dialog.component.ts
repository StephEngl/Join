import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInterface } from '../../interfaces/user.interface';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  authService = inject(AuthenticationService);
  formSubmitted = false;
  passwordVisible: Boolean = false;
  emailInput: string = '';
  passwordInput: string = '';
  noUserFound: Boolean = false;
  isGuestLogin = false;

  loginData: UserInterface = {
    email: '',
    password: '',
  };

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(ngForm: NgForm) {
    if (!this.isGuestLogin) {
    this.formSubmitted = true;
    }
  }

  async testLogin(mail: string, password: string) {
    try {
      this.noUserFound = false;
      await this.authService.signInUser(mail, password);
    } catch (error) {
      this.noUserFound = true;
      setTimeout(() => {
        this.noUserFound = false;
      }, 5000);
      console.error('Login fehlgeschlagen:', error);
    }
  }

  async adminLogin(mail: string, password: string) {
    this.isGuestLogin = true;
    this.noUserFound = false;
    // this.loginData.email = mail;
    // this.loginData.password = password;
    await this.authService.signInUser(mail, password);
    setTimeout(() => this.isGuestLogin = false, 100);
  }

}
