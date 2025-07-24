import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactsService } from '../../services/contacts.service';
import { ContactInterface } from '../../interfaces/contact.interface';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { SignalsService } from '../../services/signals.service';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactDialogComponent, CommonModule, ContactInfoComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})

/**
 * Component responsible for displaying and managing contacts.
 * Allows adding, editing, deleting, and viewing contact information.
 */
export class ContactsComponent {
  toastService = inject(ToastService);
  contactsService = inject(ContactsService);
  signalService = inject(SignalsService);
  showDialog = false;
  showBtnMenu = false;
  sortedContacts: ContactInterface[] = [];
  firstLetters: string[] = [];
  activeContactIndex: number | undefined;
  contactClicked: boolean = false;
  editId: string | undefined;
  editName: string | undefined;
  editMail: string | undefined;
  editPhone: string | undefined;
  btnDelete: boolean = false;
  btnEdit: boolean = false;


  /** Initializes the component by loading contacts and grouping them by the first letter. */
  async ngOnInit() {
    await this.loadContacts(); 
    this.signalService.checkScreenSize();
    this.groupContactsByFirstLetter();
  }

  /** Loads contacts from the service. */
  async loadContacts() {
    try {
      await this.contactsService.loadContacts();
    } catch (error) {
      console.error('Fehler beim Laden der Kontakte:', error);
    }
  }

  /** Handles window resize events to update screen size info. */
  @HostListener('window:resize', [])
  onWindowResize() {
    this.signalService.checkScreenSize();
  }

  /**Groups contacts by their first letter. */
  groupContactsByFirstLetter() {
    this.firstLetters = [...new Set(this.contactsService.contacts.map(contact => contact.name.charAt(0).toUpperCase()))];
    return this.firstLetters;
  }

  /**
   * Toggles the display of contact info.
   * @param index The index of the contact to display.
   */
  showContactInfo(index: number | undefined) {
    if (this.activeContactIndex === index && this.contactClicked && this.activeContactIndex !== undefined) {
      this.contactClicked = false;
    } else {
      this.activeContactIndex = index;
      this.contactClicked = true;
    }
  }

  /**
   * Handles the display status of the contact dialog.
   * @param event Whether to show the dialog.
   */
  handleStatusDialog(event: boolean): void {
    this.showDialog = event;
  }

  /**
   * Sets the data for editing a contact.
   * @param data The contact data to edit.
   */
  handleContactData(data: { id: string, name: string; mail: string; phone: string }) {
    this.editId = data.id;
    this.editName = data.name;
    this.editMail = data.mail;
    this.editPhone = data.phone;
  }

  /**
   * Sets the active contact index for editing.
   * @param event The index of the contact.
   */
  handleEditIndex(event: any) {
    this.activeContactIndex = event;
  }

  /**
   * Handles closing of the contact info view.
   * @param event Whether the contact info should be closed.
   */
  handleCloseContactInfo(event: boolean): void {
    this.contactClicked = !event;
  }

  /**
   * Handles the creation of a new contact.
   * @param event The index for a new contact.
   */
  handleNewContact(event: number) {
    this.showContactInfo(event);
  }

  /**
   * Starts a new contact creation process.
   */
  newContact() {
    this.contactClicked = false;
    this.activeContactIndex = undefined;
    this.showDialog = true;
    this.editName = undefined;
    this.editMail = undefined;
    this.editPhone = undefined;
  }

  /**
   * Returns the last initial of a contact's name.
   * @param index The contact index.
   */
  lastInitial(index: number): string {
    const contact = index != null ? this.contactsService.contacts[index] : null;
    if (!contact || !contact.name) return '';
    const parts = contact.name.trim().split(' ');
    const lastWord = parts.at(-1) || '';
    return lastWord.charAt(0).toUpperCase();
  }

  /** Displays additional contact info. */
  showInfos() {
    this.signalService.isInfoShown.set(true);
  }

  /**
   * Prepares a contact for editing.
   * @param index The contact index.
   */
  editContact(index: number) {
    this.showDialog = true;
    const contact = this.contactsService.contacts[index];
    this.editName = contact.name;
    this.editMail = contact.mail;
    this.editPhone = contact.phone;
  }

  /**
   * Deletes a contact.
   * @param index The contact index to delete.
   */
  async deleteContact(index: number) {
    const contactId = this.contactsService.contacts[index].id;
    if (contactId) {
      try {
        await this.contactsService.deleteContact(contactId);
        this.onContactDeleted();
        this.closeContactInfo();
        this.showBtnMenu = false;
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  }

  /** Toggles the visibility of the button menu. */
  toggleBtnMenu() {
    this.showBtnMenu = !this.showBtnMenu;
  }

  /** Closes the contact info view. */
  closeContactInfo() {
    this.signalService.isInfoShown.set(false);
    this.contactClicked = false;
  }

  /** Toggles the visibility of the dialog. */
  toggleDialog() {
    this.showDialog = !this.showDialog;
  }

  /** Displays a success message when a contact is created. */
  onContactCreated() {
    this.toastService.triggerToast('Contact successfully created', 'create');
  }

  /** Displays a success message when a contact is updated. */
  onContactUpdated() {
    this.toastService.triggerToast('Changes saved', 'update');
  }

  /** Displays a success message when a contact is deleted. */
  onContactDeleted() {
    this.toastService.triggerToast('Contact deleted', 'delete');
  }

  /** Displays an error message when an error occurs. */
  onContactError() {
    this.showDialog = false;
    this.toastService.triggerToast('Something went wrong', 'error');
  }

  /** Deletes a contact from the dialog. */
  deleteContactFromDialog(): void {
    this.showDialog = false;
    if (this.activeContactIndex !== undefined) {
      this.deleteContact(this.activeContactIndex);
    }
  }

}
