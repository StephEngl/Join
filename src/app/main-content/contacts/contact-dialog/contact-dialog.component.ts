import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, OnDestroy, Input, inject, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactInterface } from '../../../interfaces/contact.interface';
import { ContactsService } from '../../../services/contacts.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss', 'contact-dialog-media.component.scss'],
})

export class ContactDialogComponent implements OnInit, OnDestroy {

  readonly contactsService = inject(ContactsService);

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  @Output() update = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() error = new EventEmitter<void>();
  @Output() requestDelete = new EventEmitter<void>();

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

  ngOnInit(): void {
    this.contactData = {
      name: this.contactName || '',
      mail: this.contactMail || '',
      phone: this.contactPhone || '',
    };
    this.originalData = { ...this.contactData };
    setTimeout(() => (this.animateIn = true), 10);
  }

  ngOnDestroy(): void {
    this.animateIn = false;
    this.animateOut = false;
  }

  onDelete(): void {
    this.requestDelete.emit();
    this.onCancel();
  }

  onCancel(): void {
    this.animateIn = false;
    this.animateOut = true;
    setTimeout(() => this.cancel.emit(), 400);
  }

  onOverlayClick(): void {
    this.onCancel();
  }

  onCreate(index: number | undefined, form: NgForm): void {
    if (form.invalid) {
      form.controls['name']?.markAsTouched();
      form.controls['mail']?.markAsTouched();
      form.controls['phone']?.markAsTouched();
      return;
    }
    if (!this.validateName(this.contactData.name, form)) return;
    this.resetValidation();
    if (this.doubleCheckData(index)) return;
    index === undefined ? this.createNewContact() : this.editContact(index);
  }

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

  valideFullName(name: string): boolean {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 && parts.every(part => part.length >= 2);
  }

  validNameCharacters(name: string): boolean {
    const allowedCharsRegex = /^[A-Za-zÄäÖöÜüß\s'-]+$/;
    return allowedCharsRegex.test(name);
  }

  resetValidation() {
    this.nameExists = false;
    this.mailExists = false;
  }

  focusNumbers(): void {
    if (!this.contactData.phone.startsWith('+49')) {
      this.contactData.phone = '+49 ';
    }
  }

  resetNumb(): void {
    if (this.contactData.phone.trim() === '+49') {
      this.contactData.phone = '';
    }
  }

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

  handlePlusSignInput(event: KeyboardEvent, input: HTMLInputElement): void {
    const cursorPosition = input.selectionStart || 0;
    const alreadyHasPlus = input.value.includes('+');
    const isAtStart = cursorPosition === 0;
    if (!isAtStart || alreadyHasPlus) {
      event.preventDefault();
    }
  }

  doubleCheckData(index?: number): boolean {
    const double = this.contactsService.contacts.find((contact, i) => i !== index && (
      contact.name.toLowerCase() === this.contactData.name.toLowerCase() ||
      contact.mail.toLowerCase() === this.contactData.mail.toLowerCase()
    ));
    if (!double) return false;
    this.nameExists = double.name.toLowerCase() === this.contactData.name.toLowerCase();
    this.mailExists = double.mail.toLowerCase() === this.contactData.mail.toLowerCase();
    return true;
  }

  createNewContact(): void {
    this.contactData.color ||= this.contactsService.contactColors[
      Math.floor(Math.random() * this.contactsService.contactColors.length)
    ];
    this.contactData.name = this.contactData.name.charAt(0).toUpperCase() + this.contactData.name.slice(1);
    this.contactsService.addContact(this.contactData)
      .then(() => {
        this.create.emit();
        this.onCancel();
      })
      .catch(() => this.error.emit());
  }

  async editContact(index: number) {
    const contact = this.contactsService.contacts[index];
    Object.assign(contact, this.contactData);
    if (contact.id) {
      try {
        contact.name = contact.name.charAt(0).toUpperCase() + contact.name.slice(1);
        await this.contactsService.updateContact(contact);
        this.create.emit();
        this.update.emit();
        this.onCancel();
      } catch (error) {
        console.error('Fehler beim Aktualisieren:', error);
        this.error.emit();
      }
    } else {
      this.error.emit();
    }
  }

  validateLive(field: 'name' | 'mail', form: NgForm): void {
    if (field === 'name') {
      this.validateNameLive(form);
    }
    if (field === 'mail') {
      this.validateMailLive();
    }
  }

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

  validateMailLive(): void {
    this.mailExists = this.contactsService.contacts.some(
      (contact, i) => i !== this.contactIndex &&
        contact.mail.toLowerCase() === this.contactData.mail.toLowerCase()
    );
  }

  get isCreateDisabled(): boolean {
    return !this.isFormValid;
  }

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

  get isEdited(): boolean {
    return this.contactData.name !== this.originalData.name ||
      this.contactData.mail !== this.originalData.mail ||
      this.contactData.phone !== this.originalData.phone;
  }

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