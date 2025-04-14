import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { ContactInterface } from '../../../interfaces/contact.interface';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent {
  contactsService = inject(ContactsService);
  editName: string | undefined;
  editMail: string | undefined;
  editPhone: string | undefined;
  @Input()contactIndex: number | null = null;
  @Input() contactClicked: boolean = false;
  @Output()showDialog = new EventEmitter<boolean>();


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
    this.showDialog.emit(true);
    this.editName = this.contactsService.contacts[index].name;
    this.editMail = this.contactsService.contacts[index].mail;
    this.editPhone = this.contactsService.contacts[index].phone;
  }


  btnDelete: boolean = false;
  btnEdit: boolean = false;

}
