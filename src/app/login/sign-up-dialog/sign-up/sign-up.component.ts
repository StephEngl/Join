import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; /* Angular Material Toast */
import { AuthenticationService } from '../../../services/authentication.service';
import { UsersService } from '../../../services/users.service';
import { SignalsService } from '../../../services/signals.service';

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
    authService = inject(AuthenticationService);
    usersService = inject (UsersService);
    signalsService = inject(SignalsService);

    constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
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
    
        /* Prevent submission if form is invalid or checkbox not checked */
        if (!this.acceptPolicy || this.signUpForm.invalid) {
            this.signUpForm.markAllAsTouched();
    
            /* Check which part of the form is invalid and show a matching error */
            if (this.signUpForm.get('name')?.invalid) {
                this.signUpErrorMessage = 'Please enter your name.';
            } else if (this.signUpForm.get('email')?.invalid) {
                this.signUpErrorMessage = 'Please enter a valid email address.';
            } else if (this.signUpForm.get('password')?.invalid) {
                this.signUpErrorMessage = 'Password must be at least 8 characters long.';
            } else if (this.signUpForm.hasError('passwordMismatch')) {
                this.signUpErrorMessage = 'Passwords do not match.';
            } else if (!this.acceptPolicy) {
                this.signUpErrorMessage = 'Please accept the Privacy Policy.';
            } else {
                this.signUpErrorMessage = 'Please check your input.';
            }
    
            return;
        }
        const name = this.signUpForm.get('name')?.value;
        const email = this.signUpForm.get('email')?.value;
        const password = this.signUpForm.get('password')?.value;
        // const { email, password } = this.signUpForm.value;
        try {
            await this.createUser(name, email, password);
            //const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            //await sendEmailVerification(userCredential.user);  => we do not net user feedback 
            this.snackBar.open('Sign up was successful', 'OK', { duration: 3000 });
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

    // creating a user and navigate to summary
    async createUser(nameInput: string, mailInput: string, password: string) {
        const user = { name: nameInput, mail: mailInput, phone: ''}

        if (this.userAlreadyExists(user.name)) return;

        const userCredential = await this.authService.createUser(user.mail, password, user.name);
        const uid = userCredential.user.uid;
        this.usersService.addUser(uid, user);
        await this.authService.setActiveUserInitials();
        this.signalsService.hideHrefs.set(false);
        this.router.navigate(['/summary']);

    }
    //checks if email already exists
    userAlreadyExists(mail: string): boolean {
        return (
            this.usersService.users.some(user => user.mail.trim().toLowerCase() === mail.trim().toLowerCase())
        );
    }
}
