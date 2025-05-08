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
  emailTemp: string = "";
  passwordTemp: string = "";

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
      await this.authService.signInUser(this.emailTemp, this.passwordTemp);
      console.log('Login erfolgreich');
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
    }
  }
}
