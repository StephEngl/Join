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
  @Output()editIndex = new EventEmitter<number>();
  @Output()closeContactInfo = new EventEmitter<boolean>();
  @Output()editContactData = new EventEmitter<{
    id: string; 
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
        this.closeContactInfo.emit(true)
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  }

  editContact(index: number) {
    this.showDialog.emit(true);
    const contact = this.contactsService.contacts[index];
    this.editIndex.emit(index);
    if (contact.id) {
      this.editContactData.emit({
        id: contact.id,
        name: contact.name,
        mail: contact.mail,
        phone: contact.phone
      });
    }
  }

}
