import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactInterface } from '../../../interfaces/contact.interface';
import { ContactsService } from '../../../services/contacts.service';
import { NgForm } from '@angular/forms';

/**
 * The `ContactDialogComponent` is a standalone Angular component.
 * It opens a dialog where you can create, edit, or delete contacts.
 * It reacts to form input, validates data live,
 * and communicates actions back to the parent component via events.
 *
 * @example
 * <app-contact-dialog></app-contact-dialog>
 */
@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss', 'contact-dialog-media.component.scss'],
})
export class ContactDialogComponent implements OnInit, OnDestroy {

/**
 * The `ContactsService` is injected via Dependency Injection
 * and handles everything related to contacts – fetching, saving, updating, and deleting.
 */
  readonly contactsService = inject(ContactsService);

/**
 * Output events that let the parent component know what’s happening in the dialog.
 * For example, when creating, editing, deleting, or if something goes wrong.
 * Also includes events for delete confirmation and passing the new contact index.
 */
  @Output() cancelToast = new EventEmitter<void>();
  @Output() createToast = new EventEmitter<void>();
  @Output() updateToast = new EventEmitter<void>();
  @Output() deleteToast = new EventEmitter<void>();
  @Output() errorToast = new EventEmitter<void>();
  @Output() newContactIndex = new EventEmitter<number>();
  @Output() confirmDelete = new EventEmitter<void>();

/**
 * Input values to pre-fill the contact form.
 * Name, email, and phone show up right away when editing a contact.
 * The `contactIndex` tells which contact is being edited.
 */
  @Input() contactName?: string;
  @Input() contactMail?: string;
  @Input() contactPhone?: string;
  @Input() contactIndex: number | undefined;

/**
 * Controls animations and validation states in the dialog.
 * - `animateIn`: Triggers the fade-in animation when opening.
 * - `animateOut`: Triggers the fade-out animation when closing.
 * - `nameExists`: Indicates if the name is already taken.
 * - `mailExists`: Shows if the email is already in use.
 */
  animateIn = false;
  animateOut = false;
  nameExists = false;
  mailExists = false;

/**
 * The current contact data used in the form, plus a copy for comparison.
 * `contactData` is what’s currently in the form,
 * `originalData` shows what was there before – to check if anything changed.
 */
  contactData: ContactInterface = { name: '', mail: '', phone: '' };
  originalData: ContactInterface = { name: '', mail: '', phone: '' };

/**
 * Sets the form data when the dialog opens and triggers the entry animation.
 * Uses the provided `@Input` values to make the dialog visible.
 */
  ngOnInit(): void {
    this.contactData = {
      name: this.contactName || '',
      mail: this.contactMail || '',
      phone: this.contactPhone || '',
    };
    this.originalData = { ...this.contactData };
    setTimeout(() => (this.animateIn = true), 10);
  }

/**
 * Resets the animation flags when the dialog closes.
 * Keeps things clean for the next time the dialog opens.
 */
  ngOnDestroy(): void {
    this.animateIn = false;
    this.animateOut = false;
  }

/**
 * Sends a signal to the parent component to delete the contact.
 * Used when the user confirms the deletion in the dialog.
 */
  onDelete(): void {
    this.confirmDelete.emit();
  }

/**
 * Starts the fade-out animation and emits the cancel signal shortly after.
 * Happens when the user clicks “Cancel” or taps outside the overlay.
 */
  onCancel(): void {
    this.animateIn = false;
    this.animateOut = true;
    setTimeout(() => this.cancelToast.emit(), 400);
  }

/**
 * Closes the dialog when clicking outside the form area.
 * Improves usability on both mobile and desktop.
 */
  onOverlayClick(): void {
    this.onCancel();
  }

/**
 * Validates the form input and decides whether to create a new contact
 * or update an existing one – depending on whether an index is provided.
 *
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
 * Checks if the entered name is valid – meaning it contains allowed characters
 * and looks like a real first and last name.
 * If it’s invalid, the corresponding error is set directly on the form control.
 *
 * @param name - The name value to validate.
 * @param form - The Angular form used to apply validation errors.
 * @returns `true` if the name is valid, otherwise `false`.
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
 * Checks whether the name consists of at least two words,
 * with each word being at least two characters long.
 *
 * @param name - The full name to validate.
 * @returns `true` if the name meets the criteria, otherwise `false`.
 */
  valideFullName(name: string): boolean {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 && parts.every(part => part.length >= 2);
  }

  /**
 * Checks if the name contains only valid characters:
 * letters, spaces, hyphens, and apostrophes are allowed.
 *
 * @param name - The name to validate.
 * @returns `true` if the characters are valid, otherwise `false`.
 */
  validNameCharacters(name: string): boolean {
    const allowedCharsRegex = /^[A-Za-zÄäÖöÜüß\s'-]+$/;
    return allowedCharsRegex.test(name);
  }

/**
 * Resets the flags for duplicate name and email.
 * Used after validation or when the user starts typing again.
 */
  resetValidation() {
    this.nameExists = false;
    this.mailExists = false;
  }

/**
 * Automatically adds “+49” when the phone input is focused,
 * if the number doesn’t already start with the German country code.
 */
  focusNumbers(): void {
    if (!this.contactData.phone.startsWith('+49')) {
      this.contactData.phone = '+49 ';
    }
  }

/**
 * Clears the phone number field if it only contains “+49”.
 * Keeps the form clean while editing.
 */
  resetNumb(): void {
    if (this.contactData.phone.trim() === '+49') {
      this.contactData.phone = '';
    }
  }

/**
 * Allows only valid characters while typing in the phone number field:
 * digits, spaces, dashes – and the plus sign only at the beginning.
 *
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
    if (!isDigit) {
      event.preventDefault();
    }
  }

/**
 * Blocks the “+” character if it’s typed more than once or not at the beginning.
 * Only allowed at the very start of the phone number.
 *
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
 * The current contact (based on the index) is ignored in the check.
 *
 * @param index - Optional index of the current contact to exclude from the check.
 * @returns `true` if a duplicate is found, otherwise `false`.
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

/**
 * Creates a new contact, assigns it a random color,
 * and saves it using the contact service.
 * On success, a toast is shown and the dialog is closed.
 */
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

/**
 * Sends the index of the newly created contact to the parent component.
 * Used to highlight or scroll to the new contact, for example.
 */
  emitNewContactIndex() {
    const index = this.contactsService.contacts.findIndex(
      contact => contact.name === this.contactData.name
    );
    this.newContactIndex.emit(index);
  }

/**
 * Saves changes to an existing contact.
 * On success or failure, the appropriate toast is shown.
 *
 * @param index - The index of the contact to update.
 */
  async editContact(index: number) {
    const contact = this.contactsService.contacts[index];
    Object.assign(contact, this.contactData);
    if (contact.id) {
      try {
        contact.name = contact.name.charAt(0).toUpperCase() + contact.name.slice(1);
        await this.contactsService.updateContact(contact);
        this.createToast.emit();
        this.updateToast.emit();
        this.onCancel();
      } catch (error) {
        console.error('Fehler beim Aktualisieren:', error);
        this.errorToast.emit();
      }
    } else {
      this.errorToast.emit();
    }
  }

/**
 * Live-validates a specific field like name or email,
 * including format and duplicate checks.
 *
 * @param field - Either 'name' or 'mail' to determine which field to validate.
 * @param form - The Angular form used for applying validation errors.
 */
  validateLive(field: 'name' | 'mail', form: NgForm): void {
    if (field === 'name') {
      this.validateNameLive(form);
    }
    if (field === 'mail') {
      this.validateMailLive();
    }
  }

/**
 * Live-validates the name field – checks if the name is valid and not already taken.
 * Validation errors are applied directly to the form control.
 *
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
      (contact, i) => i !== this.contactIndex &&
        contact.name.toLowerCase() === this.contactData.name.toLowerCase()
    );
  }

/**
 * Live-validates the email field – checks if it’s valid and not already in use.
 */
  validateMailLive(): void {
    this.mailExists = this.contactsService.contacts.some(
      (contact, i) => i !== this.contactIndex &&
        contact.mail.toLowerCase() === this.contactData.mail.toLowerCase()
    );
  }

/**
 * Returns `true` if the form still has errors –
 * used to keep the “Create” button disabled.
 *
 * @returns `true` if the form is invalid.
 */
  get isCreateDisabled(): boolean {
    return !this.isFormValid;
  }

/**
 * Returns `true` if all fields are valid and no duplicates exist.
 * Shows the checkmark icon next to the button when inputs are complete.
 *
 * @returns `true` if the form is fully valid and ready.
 */
  get isCheckmarkVisible(): boolean {
    const nameValid = this.validNameCharacters(this.contactData.name) &&
      this.valideFullName(this.contactData.name) &&
      !this.nameExists;
    const mailValid = !!this.contactData.mail.trim() &&
      /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.contactData.mail) &&
      !this.mailExists;
    const phoneValid = /^\+49[\s\d\-]{5,}$/.test(this.contactData.phone.trim());
    const validFields = [nameValid, mailValid, phoneValid].filter(valide => valide === true).length;
    return validFields === 3;
  }

/**
 * Checks if any changes were made since the dialog was opened.
 * Used to decide whether the “Save” button should be active.
 *
 * @returns `true` if the contact data was modified.
 */
  get isEdited(): boolean {
    return this.contactData.name !== this.originalData.name ||
      this.contactData.mail !== this.originalData.mail ||
      this.contactData.phone !== this.originalData.phone;
  }

/**
 * Checks if the entire form is valid:
 * name, email, and phone number are all okay – and no duplicates exist.
 *
 * @returns `true` if the form is valid and ready to submit.
 */
  get isFormValid(): boolean {
    const nameValid = this.validNameCharacters(this.contactData.name) &&
      this.valideFullName(this.contactData.name) &&
      !this.nameExists;
    const mailValid = !!this.contactData.mail.trim() &&
      /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.contactData.mail) &&
      !this.mailExists;
    const phoneValid = /^(\+|00)?\d[\d\s\/\-]{4,}$/.test(this.contactData.phone.trim());
    return nameValid && mailValid && phoneValid;
  }

}
