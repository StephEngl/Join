import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
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
    toastService = inject(ToastService);
    fb = inject(FormBuilder);
    signUpForm: FormGroup;
    hidePassword = true;
    hideConfirmPassword = true;
    signUpErrorMessage: string | null = null;
    acceptPolicy: boolean = false;

    constructor() {
        this.signUpForm = this.fb.group({
            name: ['', [Validators.required, this.validateFullName]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }


    validateFullName(control: AbstractControl): ValidationErrors | null {
        const value = control.value?.trim();
        if (!value) return null;
        const words = value.split(/\s+/);
        return words.length >= 2 ? null : { invalidFullName: true };
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
        const name = this.signUpForm.get('name')?.value;
        const email = this.signUpForm.get('email')?.value;
        const password = this.signUpForm.get('password')?.value;
        try {
            await this.createUser(name, email, password);
            this.toastService.triggerToast(
                'Sign up successful',
                'create',
            );
            this.signUpSuccess.emit();
        } catch (error: any) {
            this.signUpErrorMessage = this.getFirebaseErrorMessage(error);
            this.toastService.triggerToast(
                this.signUpErrorMessage,
                'error',
            );
        }
    }


    getFirebaseErrorMessage(error: any): string {
        if (error.code === 'auth/email-already-in-use') return 'This email address is already registered.';
        if (error.code === 'auth/invalid-email') return 'The email address is not valid.';
        if (error.code === 'auth/weak-password') return 'The password is too weak (minimum 8 characters).';
        return 'Registration failed. Please try again later.';
    }


    async createUser(nameInput: string, mailInput: string, password: string) {
        const user = { name: nameInput, mail: mailInput, phone: '' }
        if (this.userAlreadyExists(user.name)) return;
        const userCredential = await this.authService.createUser(user.mail, password, user.name);
        const uid = userCredential.user.uid;
        this.usersService.addUser(uid, user);
        await this.authService.setActiveUserInitials();
        this.router.navigate(['/summary']);
    }
    

    userAlreadyExists(mail: string): boolean {
        return (
            this.usersService.users.some(user => user.mail.trim().toLowerCase() === mail.trim().toLowerCase())
        );
    }
}

