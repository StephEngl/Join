import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInterface } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  formSubmitted = false;
  passwordVisible: Boolean = false;

  loginData: UserInterface = {
    email: '',
    password: '',
  };

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(ngForm: NgForm) {
    this.formSubmitted = true;
    console.log("Login bestätigt:", this.formSubmitted);
    
    if (ngForm.submitted && ngForm.form.valid) {
    }
  }
}
