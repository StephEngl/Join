import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
    selector: 'app-sign-up-dialog',
    standalone: true,
    imports: [CommonModule, SignUpComponent],
    templateUrl: './sign-up-dialog.component.html',
    styleUrl: './sign-up-dialog.component.scss'
})
export class SignUpDialogComponent {
    @Output() closeDialog = new EventEmitter<void>(); /* Emits when user clicks outside dialog */
    @Output() signUpSuccess = new EventEmitter<void>(); /* Emits when sign-up is successful */

    /* Detect clicks outside the dialog area and emit close */
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.sign-up-dialog-section')) {
            this.closeDialog.emit(); /* Close triggered from outside click */
        }
    }

    /* Called by sign-up child component when user creation was successful */
    onSignUpSuccess() {
        this.signUpSuccess.emit(); /* Notify parent: login.component */
    }
}
