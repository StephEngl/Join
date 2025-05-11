import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { SignalsService } from '../../services/signals.service';

@Component({
    selector: 'app-sign-up-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
    templateUrl: './sign-up-dialog.component.html',
    styleUrl: './sign-up-dialog.component.scss'
})
export class SignUpDialogComponent {
    @Output() closeDialog = new EventEmitter<void>();
    @Output() signUpSuccess = new EventEmitter<void>();

    auth = inject(Auth);
    authService = inject(AuthenticationService);
    usersService = inject(UsersService);
    signalService = inject(SignalsService);
    router = inject(Router);
    snackbar = inject(MatSnackBar);
    fb = inject(FormBuilder);

    signUpForm: FormGroup;
    hidePassword = true;
    hideConfirmPassword = true;
    signUpErrorMessage: string | null = null;
    acceptPolicy: boolean = false;

    constructor() {
        this.signUpForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
        const p = form.get('password')?.value;
        const c = form.get('confirmPassword')?.value;
        return p === c ? null : { passwordMismatch: true };
    }

    async submitSignUp(): Promise<void> {
        this.signUpErrorMessage = null;
        if (!this.acceptPolicy || this.signUpForm.invalid) {
            this.signUpForm.markAllAsTouched();
            return;
        }

        const { email, password } = this.signUpForm.value;
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            await sendEmailVerification(userCredential.user);
            this.snackbar.open('Sign up was successful', 'OK', { duration: 3000 });
            this.signUpSuccess.emit();
        } catch (error: any) {
            this.signUpErrorMessage = this.getFirebaseErrorMessage(error);
        }
    }

    getFirebaseErrorMessage(error: any): string {
        if (error.code === 'auth/email-already-in-use') return 'This email address is already registered.';
        if (error.code === 'auth/invalid-email') return 'The email address is not valid.';
        if (error.code === 'auth/weak-password') return 'The password is too weak (minimum 8 characters).';
        return 'Registration failed. Please try again later.';
    }
}
