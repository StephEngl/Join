import { Component, Input, inject, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { SignalsService } from '../../../services/signals.service';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent {
  contactsService = inject(ContactsService);
  signalService = inject(SignalsService);
  @Input()contactIndex: number | null = null;
  @Input() isClicked: boolean = false;
  @Output()showDialog = new EventEmitter<boolean>();
  @Output() editIndex = new EventEmitter<number>();
  @Output() editContactData = new EventEmitter<{ 
    name: string;
    mail: string;
    phone: string
  }>();

  btnDelete: boolean = false;
  btnEdit: boolean = false;

  ngOnInit() {
    this.signalService.checkScreenSize();
  }
  
  @HostListener('window:resize', [])
  onWindowResize() {
    this.signalService.checkScreenSize();
  }

  async deleteContact(index: number) {
    const contact = this.contactsService.contacts[index];
    if (contact.id) {
      try {
        await this.contactsService.deleteContact(contact.id);
        console.log('Kontakt erfolgreich gelöscht');
      } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
      }
    }
  }

  editContact(index: number) {
    this.showDialog.emit(true);
    const contact = this.contactsService.contacts[index];
    this.editIndex.emit(index);
    this.editContactData.emit({
      name: contact.name,
      mail: contact.mail,
      phone: contact.phone
    });
  }

  lastInitial(index: number): string {
    const contact = index != null ? this.contactsService.contacts[index] : null;
    if (!contact || !contact.name) return '';
    const parts = contact.name.trim().split(' ');
    const lastWord = parts.at(-1) || '';
    return lastWord.charAt(0).toUpperCase();
  }

  closeContactInfo() {
    this.signalService.isInfoShown = false;
  }

}
