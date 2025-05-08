import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
    selector: 'app-sign-up-dialog',
    standalone: true,
    imports: [CommonModule, SignUpComponent],
    templateUrl: './sign-up-dialog.component.html',
    styleUrl: './sign-up-dialog.component.scss'
})
export class SignUpDialogComponent { /* container only */ }
