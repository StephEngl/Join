import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactInterface } from '../../../interfaces/contact.interface';
import { ContactsService } from '../../../services/contacts.service';
import { NgForm } from '@angular/forms';

/**
 * This component is for creating, editing, or deleting contacts.
 * It validates input live and emits events to the parent component.
 */
@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss', 'contact-dialog-media.component.scss'],
})
export class ContactDialogComponent implements OnInit, OnDestroy {

  contactsService = inject(ContactsService);
  @Output() cancelToast = new EventEmitter<void>();
  @Output() createToast = new EventEmitter<void>();
  @Output() updateToast = new EventEmitter<void>();
  @Output() deleteToast = new EventEmitter<void>();
  @Output() errorToast = new EventEmitter<void>();
  @Output() newContactIndex = new EventEmitter<number>();
  @Output() confirmDelete = new EventEmitter<void>();
  @Input() contactName?: string;
  @Input() contactMail?: string;
  @Input() contactPhone?: string;
  @Input() contactIndex: number | undefined;
  animateIn = false;
  animateOut = false;
  nameExists = false;
  mailExists = false;
  contactData: ContactInterface = { name: '', mail: '', phone: '' };
  originalData: ContactInterface = { name: '', mail: '', phone: '' };

  /** Sets the form data when the dialog opens and triggers the entry animation. */
  ngOnInit(): void {
    this.contactData = {
      name: this.contactName || '',
      mail: this.contactMail || '',
      phone: this.contactPhone || '',
    };
    this.originalData = { ...this.contactData };
    setTimeout(() => (this.animateIn = true), 10);
  }

  /** Resets the animation flags when the dialog closes. */
  ngOnDestroy(): void {
    this.animateIn = false;
    this.animateOut = false;
  }

  /** Sends a signal to the parent component to delete the contact. */
  onDelete(): void {
    this.confirmDelete.emit();
  }

  /** Starts the fade-out animation and emits the cancel signal shortly after. */
  onCancel(): void {
    this.animateIn = false;
    this.animateOut = true;
    setTimeout(() => this.cancelToast.emit(), 400);
  }

  /** Closes the dialog when clicking outside the form area. */
  onOverlayClick(): void {
    this.onCancel();
  }

  /**
   * Validates the form input and decides whether to create a new contact or update an existing one.
   * @param index - The index of the contact to update, or `undefined` to create a new one.
   * @param form - The Angular form reference used for validation.
   */
  onCreate(index: number | undefined, form: NgForm): void {
    if (form.invalid) {
      form.controls['name']?.markAsTouched();
      form.controls['mail']?.markAsTouched();
      form.controls['phone']?.markAsTouched();
      return;
    }
    if (!this.validateName(this.contactData.name, form)) return;
    this.resetValidation();
    if (this.doubleCheckDataContact(index)) return;
    index === undefined ? this.createNewContact() : this.editContact(index);
  }

  /**
   * Checks if the entered name is valid.
   * @param name - The name value to validate.
   * @param form - The Angular form used to apply validation errors.
   */
  validateName(name: string, form: NgForm): boolean {
    if (!this.validNameCharacters(name)) {
      form.controls['name']?.setErrors({ invalidCharacters: true });
      return false;
    }
    if (!this.valideFullName(name)) {
      form.controls['name']?.setErrors({ invalidFullName: true });
      return false;
    }
    return true;
  }

  /**
   * Checks whether the name consists of at least two words.
   * @param name - The full name to validate.
   */
  valideFullName(name: string): boolean {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 && parts.every(part => part.length >= 2);
  }

  /**
   * Checks if the name contains only valid characters.
   * @param name - The name to validate.
   */
  validNameCharacters(name: string): boolean {
    const allowedCharsRegex = /^[A-Za-zÄäÖöÜüß\s'-]+$/;
    return allowedCharsRegex.test(name);
  }

  /** Resets the flags for duplicate name and email. */
  resetValidation() {
    this.nameExists = false;
    this.mailExists = false;
  }

  /** Automatically adds “+49” when the phone input is focused. */
  focusNumbers(): void {
    if (!this.contactData.phone.startsWith('+49')) {
      this.contactData.phone = '+49 ';
    }
  }

  /** * Clears the phone number field if it only contains “+49”. */
  resetNumb(): void {
    if (this.contactData.phone.trim() === '+49') {
      this.contactData.phone = '';
    }
  }

  /**
   * Allows only valid characters while typing in the phone number field.
   * @param event - The keyboard event triggered while typing.
   */
  onlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', ' ', '-', '/'];
    const input = event.target as HTMLInputElement;
    const key = event.key;
    if (allowedKeys.includes(key)) return;
    if (key === '+') {
      this.handlePlusSignInput(event, input);
      return;
    }
    const isDigit = /^\d$/.test(key);
    if (!isDigit) { event.preventDefault() }
  }

  /**
   * Blocks the “+” character if it’s typed more than once or not at the beginning.
   * @param event - The keyboard event triggered by the user.
   * @param input - The input element where the key was pressed.
   */
  handlePlusSignInput(event: KeyboardEvent, input: HTMLInputElement): void {
    const cursorPosition = input.selectionStart || 0;
    const alreadyHasPlus = input.value.includes('+');
    const isAtStart = cursorPosition === 0;
    if (!isAtStart || alreadyHasPlus) {
      event.preventDefault();
    }
  }

  /**
   * Checks if a contact with the same name or email already exists.
   * @param index - Optional index of the current contact to exclude from the check.
   */
  doubleCheckDataContact(index?: number): boolean {
    const double = this.contactsService.contacts.find((contact, i) => i !== index && (
      contact.name.toLowerCase() === this.contactData.name.toLowerCase() ||
      contact.mail.toLowerCase() === this.contactData.mail.toLowerCase()
    ));
    if (!double) return false;
    this.nameExists = double.name.toLowerCase() === this.contactData.name.toLowerCase();
    this.mailExists = double.mail.toLowerCase() === this.contactData.mail.toLowerCase();
    return true;
  }

  /** Creates a new contact, assigns it a random color. */
  createNewContact(): void {
    this.contactData.color ||= this.contactsService.contactColors[
      Math.floor(Math.random() * this.contactsService.contactColors.length)
    ];
    this.contactData.name = this.contactData.name.charAt(0).toUpperCase() + this.contactData.name.slice(1);
    this.contactsService.addContact(this.contactData)
      .then(() => {
        this.emitNewContactIndex();
        this.createToast.emit();
        this.onCancel();
      })
      .catch(() => this.errorToast.emit());
  }

  /** Sends the index of the newly created contact to the parent component. */
  emitNewContactIndex() {
    const index = this.contactsService.contacts.findIndex(
      contact => contact.name === this.contactData.name
    );
    this.newContactIndex.emit(index);
  }

  /**
   * Saves changes to an existing contact.
   * @param index - The index of the contact to update.
   */
  async editContact(index: number) {
    const contact = this.contactsService.contacts[index];
    Object.assign(contact, this.contactData);
    if (contact.id) {
      try {
        contact.name = contact.name.charAt(0).toUpperCase() + contact.name.slice(1);
        await this.contactsService.updateContact(contact);
        this.cancelWithToastMessages();
      } catch (error) {
        console.error('Fehler beim Aktualisieren:', error);
        this.errorToast.emit();
      }
    }
  }

  /** Emits success toast messages for create and update actions, and resets the form. */
  cancelWithToastMessages() {
    this.createToast.emit();
    this.updateToast.emit();
    this.onCancel();
  }

  /**
   * Live-validates a specific field like name or email, including format and duplicate checks.
   * @param field - Either 'name' or 'mail' to determine which field to validate.
   * @param form - The Angular form used for applying validation errors.
   */
  validateLive(field: 'name' | 'mail', form: NgForm): void {
    if (field === 'name') { this.validateNameLive(form) }
    if (field === 'mail') { this.validateMailLive() }
  }

  /**
   * Live-validates the name field – checks if the name is valid and not already taken.
   * @param form - The Angular form used to apply validation errors.
   */
  validateNameLive(form: NgForm): void {
    if (!this.validNameCharacters(this.contactData.name)) {
      form.controls['name']?.setErrors({ invalidCharacters: true });
    } else if (!this.valideFullName(this.contactData.name)) {
      form.controls['name']?.setErrors({ invalidFullName: true });
    } else {
      form.controls['name']?.setErrors(null);
    }
    this.nameExists = this.contactsService.contacts.some(
      (contact, i) => i !== this.contactIndex
        && contact.name.toLowerCase() === this.contactData.name.toLowerCase()
    );
  }

  /** Live-validates the email field – checks if it’s valid and not already in use. */
  validateMailLive(): void {
    this.mailExists = this.contactsService.contacts.some(
      (contact, i) => i !== this.contactIndex
        && contact.mail.toLowerCase() === this.contactData.mail.toLowerCase()
    );
  }

  /** Returns `true` if the form still has errors */
  get isCreateDisabled(): boolean {
    return !this.isFormValid;
  }

  /** Returns `true` if all fields are valid and no duplicates exist. */
  get isCheckmarkVisible(): boolean {
    const nameValid = this.validNameCharacters(this.contactData.name)
      && this.valideFullName(this.contactData.name)
      && !this.nameExists;
    const mailValid = !!this.contactData.mail.trim()
      && /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.contactData.mail)
      && !this.mailExists;
    const phoneValid = /^\+49[\s\d\-]{5,}$/.test(this.contactData.phone.trim());
    const validFields = [nameValid, mailValid, phoneValid].filter(valide => valide === true).length;
    return validFields === 3;
  }

  /** Checks if any changes were made since the dialog was opened. */
  get isEdited(): boolean {
    return this.contactData.name !== this.originalData.name ||
      this.contactData.mail !== this.originalData.mail ||
      this.contactData.phone !== this.originalData.phone;
  }

  /** Checks if the entire form is valid. */
  get isFormValid(): boolean {
    const nameValid = this.validNameCharacters(this.contactData.name)
      && this.valideFullName(this.contactData.name)
      && !this.nameExists;
    const mailValid = !!this.contactData.mail.trim()
      && /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.contactData.mail)
      && !this.mailExists;
    const phoneValid = /^(\+|00)?\d[\d\s\/\-]{4,}$/.test(this.contactData.phone.trim());
    return nameValid && mailValid && phoneValid;
  }

}
