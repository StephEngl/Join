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

  loginData: UserInterface = {
    email: '',
    password: '',
  };

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(ngForm: NgForm) {
    this.formSubmitted = true;
    console.log('Login bestätigt:', this.formSubmitted);

    if (ngForm.submitted && ngForm.form.valid) {
    }
  }

  async testLogin() {
    try {
      this.noUserFound = false;
      await this.authService.signInUser(this.emailInput, this.passwordInput);
      console.log('Login erfolgreich');
    } catch (error) {
      this.noUserFound = true;
      setTimeout(() => {
        this.noUserFound = false;
      }, 5000);
      console.error('Login fehlgeschlagen:', error);
    }
  }
}
