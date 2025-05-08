import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
    signUpForm: FormGroup;
    hidePassword = true; hideConfirmPassword = true;
    signUpErrorMessage: string | null = null;
    acceptPolicy: boolean = false;

    constructor(private fb: FormBuilder, private auth: Auth) {
        this.signUpForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    async onSignUp(): Promise<void> {
        this.signUpErrorMessage = null;
        if (!this.acceptPolicy || this.signUpForm.invalid) {
            this.signUpForm.markAllAsTouched();
            return;
        }

        const { email, password } = this.signUpForm.value;
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            await sendEmailVerification(userCredential.user);
            this.onSignUpSuccess();
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

    private onSignUpSuccess(): void {
        console.log('Sign-up successful');
    }
}
