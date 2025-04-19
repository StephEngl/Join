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
  styleUrls: ['./contact-dialog.component.scss'],
})
export class ContactDialogComponent implements OnInit, OnDestroy {

  readonly contactsService = inject(ContactsService);
  readonly nameBlacklist = [
    'arschloch', 'hurensohn', 'idiot', 'dummkopf', 'wichser', 'hure', 'schlampe',
    'ficker', 'miststück', 'penner', 'spast', 'bastard', 'scheißkerl', 'scheisse', 'verpisser',
    'spasti', 'nutte', 'depp', 'trottel', 'versager', 'mongo', 'vollidiot', 'huso', 'hurenkind',
    'schwachkopf', 'drecksack', 'arsch', 'blödmann', 'klappspaten', 'pisser', 'krüppel', 'verrückt',
    'missgeburt', 'abfall', 'abschaum', 'dumm', 'hirnlos', 'nullnummer', 'irre', 'psychopath',
    'arschgeige', 'geistesgestört', 'freak', 'honk', 'atze', 'nazi', 'hitler', 'hitlergruß', 'nigger', 'zigeuner', 'kackhaufen',
    'fotze', 'weichei', 'feigling', 'taubstumm'
  ];

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
    if (this.blackListName(name)) {
      form.controls['name']?.setErrors({ forbiddenWord: true });
      return false;
    }
    return true;
  }

  blackListName(name: string): boolean {
    const lower = name.toLowerCase();
    return this.nameBlacklist.some(entry => lower.includes(entry));
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
    if (!this.contactData.phone || this.contactData.phone.trim() === '') {
      this.contactData.phone = '+49 ';
    }
  }

  resetNumb(): void {
    if (this.contactData.phone.trim() === '+49') {
      this.contactData.phone = '';
    }
  }

  onlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const input = event.target as HTMLInputElement;
    if (allowedKeys.includes(event.key)) return;
    const currentValue = input.value;
    const cursorPosition = input.selectionStart || 0;
    if (!/^\d$/.test(event.key) || (cursorPosition < 4 && currentValue.startsWith('+49'))) {
      event.preventDefault();
    }
  }

  noDeleteNumb(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart || 0;
    const prefix = '+49 ';
    if (
      (event.key === 'Backspace' && cursorPos <= prefix.length) ||
      (event.key === 'Delete' && cursorPos < prefix.length)
    ) {
      event.preventDefault();
    }
    if (!input.value.startsWith(prefix)) {
      input.value = prefix + input.value.replace(/^\+?49\s?/, '');
      this.contactData.phone = input.value;
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

  get isCreateDisabled(): boolean {
    return !this.isAllFilled;
  }

  get isCheckmarkVisible(): boolean {
    return [this.contactData.name, this.contactData.mail, this.contactData.phone]
      .filter(val => val.trim()).length === 2;
  }

  get isAllFilled(): boolean {
    const { name, mail, phone } = this.contactData;
    return !!name.trim() && !!mail.trim() && !!phone.trim();
  }

  get isEdited(): boolean {
    return this.contactData.name !== this.originalData.name ||
      this.contactData.mail !== this.originalData.mail ||
      this.contactData.phone !== this.originalData.phone;
  }
}