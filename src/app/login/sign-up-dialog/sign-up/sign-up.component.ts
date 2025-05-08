import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; /* Angular Material Toast */

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
    @Output() signUpSuccess = new EventEmitter<void>();

    signUpForm: FormGroup;
    hidePassword = true;
    hideConfirmPassword = true;
    signUpErrorMessage: string | null = null;
    acceptPolicy: boolean = false;

    private snackBar = inject(MatSnackBar); /* Injecting Angular Toast service */

    constructor(private fb: FormBuilder, private auth: Auth) {
        this.signUpForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
             /* Use built-in Angular validator to ensure minimum password length */
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
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

            /* Replaced alert with snackbar */
            this.snackBar.open('Sign up was successful', 'OK', { duration: 3000 }); /* Toast instead of alert */
            this.signUpSuccess.emit();
        } catch (error: any) {
            this.signUpErrorMessage = this.getFirebaseErrorMessage(error);
        }
    }

    passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
        const p = form.get('password')?.value, c = form.get('confirmPassword')?.value;
        return p === c ? null : { passwordMismatch: true };
    }

    private getFirebaseErrorMessage(error: any): string {
        if (error.code === 'auth/email-already-in-use') return 'This email address is already registered.';
        if (error.code === 'auth/invalid-email') return 'The email address is not valid.';
        if (error.code === 'auth/weak-password') return 'The password is too weak (minimum 6 characters).';
        return 'Registration failed. Please try again later.';
    }

    // /* This method was used previously but is no longer needed */
    // private onSignUpSuccess(): void {
    //     console.log('Sign-up successful');
    // }
}
