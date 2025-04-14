import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactsService } from '../../services/contacts.service';
import { ContactInterface } from '../../interfaces/contact.interface';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactDialogComponent, CommonModule],
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
  btnDelete: boolean = false;
  btnEdit: boolean = false;
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
    if (this.activeContactIndex === index && this.contactClicked) {
      this.contactClicked = false;
    } else {
      this.activeContactIndex = index;
      this.contactClicked = true;
    }
  }

  async deleteContact() {
    const docId = '1JZx6aGq41MRooCAOS0P'; //Platzhalter, existiert jetzt nicht mehr :)
    try {
      await this.contactsService.deleteContact(docId);
      console.log('Kontakt erfolgreich gelöscht');
    } catch (error) {
      console.error('Fehler beim Löschen des Kontakts:', error);
    }
  }

  editContact(index: number) {
    this.showDialog = true;
    this.editName = this.contactsService.contacts[index].name;
    this.editMail = this.contactsService.contacts[index].mail;
    this.editPhone = this.contactsService.contacts[index].phone;
  }
}
