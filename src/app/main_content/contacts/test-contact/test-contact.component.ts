import { Component } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';


@Component({
  selector: 'app-test-contact',
  standalone: true,
  imports: [],
  templateUrl: './test-contact.component.html',
  styleUrl: './test-contact.component.scss'
})
export class TestContactComponent {
  constructor(private contactsService: ContactsService) {}

  async testUpdate() {
    const contact = {
      id: '1JZx6aGq41MRooCAOS0P', // ID eines existierenden Kontakts
      name: 'Hans Mayer',
      phone: '+49 165 9876543',
      mail: 'h.mayer@blauerhimmel.de'
    };

    try {
      await this.contactsService.updateContact(contact);
      console.log('Kontakt erfolgreich aktualisiert');
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Kontakts:', error);
    }
  }
}
