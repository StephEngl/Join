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

/**
 * This component displays detailed information
 * about a contact, including options to edit or delete the contact. It emits events to notify parent
 * components of user interactions and manages actions like contact deletion and editing.
 */
export class ContactInfoComponent {
  contactsService = inject(ContactsService);
  signalService = inject(SignalsService);
  @Input() contactIndex: number | undefined;
  @Input() isClicked: boolean = false;
  @Output() showDialog = new EventEmitter<boolean>();
  @Output() editIndex = new EventEmitter<number>();
  @Output() closeContactInfo = new EventEmitter<boolean>();
  @Output() deleteContactWithToast = new EventEmitter<number>();
  @Output() editContactData = new EventEmitter<{
    id: string;
    name: string;
    mail: string;
    phone: string
  }>();
  btnDelete: boolean = false;
  btnEdit: boolean = false;


  /** Lifecycle hook that checks the screen size on component initialization. */
  ngOnInit() {
    this.signalService.checkScreenSize();
  }

  /** Host listener that triggers on window resize events to check the screen size. */
  @HostListener('window:resize', [])
  onWindowResize() {
    this.signalService.checkScreenSize();
  }

  /**
   * Deletes a contact based on the provided index and emits an event to close the contact info.
   * @param index - The index of the contact to delete.
   */
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

  /**
   * Emits the contact data to trigger the editing process and displays the contact dialog.
   * @param index - The index of the contact to edit.
   */
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

  /**
   * Triggers the deletion of a contact and sends the index to the parent component.
   * @param index - The index of the contact to delete.
   */
  triggerDelete(index: number): void {
    this.deleteContactWithToast.emit(index);
  }

}
