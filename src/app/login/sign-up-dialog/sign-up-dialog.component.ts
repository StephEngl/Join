import { Component, Output, EventEmitter, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { SignalsService } from '../../services/signals.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up-dialog.component.html',
  styleUrl: './sign-up-dialog.component.scss',
})
export class SignUpDialogComponent {
  @Output() closeDialog = new EventEmitter<void>();
  @Output() signUpSuccess = new EventEmitter<void>();

  auth = inject(Auth);
  authService = inject(AuthenticationService);
  usersService = inject(UsersService);
  signalService = inject(SignalsService);
  router = inject(Router);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);
  signUpForm: FormGroup;
  signUpErrorMessage: string | null = null;
  acceptPolicy: boolean = false;
  passwordVisible: Boolean = false;
  confirmPasswordVisible: Boolean = false;


  constructor() {
    this.signUpForm = this.fb.group(
      {
        name: ['', [Validators.required, this.validateFullName]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /**
   * Custom validator to check that the full name contains at least two words.
   * @param control AbstractControl - the control to validate
   * @returns ValidationErrors | null
   */
  validateFullName(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    if (!value) return null;
    const words = value.split(/\s+/);
    return words.length >= 2 ? null : { invalidFullName: true };
  }

  /**
   * Validator to ensure password and confirmPassword fields match.
   * @param form AbstractControl - the form group
   * @returns ValidationErrors | null
   */
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const p = form.get('password')?.value;
    const c = form.get('confirmPassword')?.value;
    return p === c ? null : { passwordMismatch: true };
  }

  /**
   * Handles the sign-up form submission.
   * Performs validation and attempts to create a new user.
   */
  async submitSignUp(): Promise<void> {
    this.signUpErrorMessage = null;
    if (this.shouldBlockSubmit()) return;
    const name = this.signUpForm.get('name')?.value;
    const email = this.signUpForm.get('email')?.value;
    const password = this.signUpForm.get('password')?.value;
    try {
      await this.createUser(name, email, password);
      this.toastService.triggerToast('Sign up successful', 'create');
      this.signUpSuccess.emit();
    } catch (error: any) {
      this.signUpErrorMessage = this.getFirebaseErrorMessage(error);
      this.toastService.triggerToast(this.signUpErrorMessage, 'error');
    }
  }

  /**
   * Checks if the form is valid and policy is accepted.
   * Marks all fields as touched if validation fails.
   * @returns boolean - true if submission should be blocked
   */
  shouldBlockSubmit(): boolean {
    if (!this.acceptPolicy || this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return true;
    }
    return false;
  }

  /**
   * Maps Firebase error codes to user-friendly messages.
   * @param error any - the error returned from Firebase
   * @returns string - a descriptive error message
   */
  getFirebaseErrorMessage(error: any): string {
    if (error.code === 'auth/email-already-in-use')
      return 'This email address is already registered.';
    if (error.code === 'auth/invalid-email')
      return 'The email address is not valid.';
    if (error.code === 'auth/weak-password')
      return 'The password is too weak (minimum 8 characters).';
    return 'Registration failed. Please try again later.';
  }

  /**
   * Creates a new user with the given credentials and navigates to the summary page.
   * @param nameInput string - user's full name
   * @param mailInput string - user's email address
   * @param password string - user's password
   */
  async createUser(nameInput: string, mailInput: string, password: string) {
    const user = { name: nameInput, mail: mailInput, phone: '' };
    if (this.userAlreadyExists(user.name)) return;
    const userCredential = await this.authService.createUser(
      user.mail,
      password,
      user.name
    );
    const uid = userCredential.user.uid;
    this.usersService.addUser(uid, user);
    await this.authService.setActiveUserInitials();
    this.router.navigate(['/summary']);
  }

  /**
   * Checks whether a user with the same email already exists in the local list.
   * @param mail string - email to check
   * @returns boolean - true if the user already exists
   */
  userAlreadyExists(mail: string): boolean {
    return this.usersService.users.some(
      (user) => user.mail.trim().toLowerCase() === mail.trim().toLowerCase()
    );
  }

  /** Toggles the visibility of the password input field. */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

    /** Toggles the visibility of the confirm password input field. */
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
