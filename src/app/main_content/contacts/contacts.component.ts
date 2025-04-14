import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactsService } from '../../services/contacts.service';
import { ContactInterface } from '../../interfaces/contact.interface';
import { ContactInfoComponent } from './contact-info/contact-info.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactDialogComponent, CommonModule, ContactInfoComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})

export class ContactsComponent {
  contactsService = inject(ContactsService);
  showDialog = false;
  sortedContacts: ContactInterface[] = [];
  firstLetters: string[] = [];
  activeContactIndex: number | null = null;
  contactClicked: boolean = false;
  editName: string | undefined;
  editMail: string | undefined;
  editPhone: string | undefined;

  ngOnInit() {
    this.groupContactsByFirstLetter();
  }

  toggleDialog() {
    this.showDialog = !this.showDialog;
  }

  groupContactsByFirstLetter() {
    this.firstLetters = [...new Set(this.contactsService.contacts.map(contact => contact.name.charAt(0).toUpperCase()))];
    return this.firstLetters;  
  }

  showContactInfo(index: number | null) {
    if (this.activeContactIndex === index && this.contactClicked && this.activeContactIndex !== null) {
      this.contactClicked = false;
    } else {
      this.activeContactIndex = index;
      this.contactClicked = true;
    }
  }

  setStatusDialog(event: boolean): void {
    this.showDialog = event;
  }

  newContact() {
    this.showDialog = true;
    this.editName = undefined;
    this.editMail = undefined;
    this.editPhone = undefined;
  }

  lastInitial(index: number): string {
    const contact = index != null ? this.contactsService.contacts[index] : null;
    if (!contact || !contact.name) return '';
    const parts = contact.name.trim().split(' ');
    const lastWord = parts.at(-1) || '';
    return lastWord.charAt(0).toUpperCase();
  }

}
