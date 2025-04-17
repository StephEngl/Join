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
    this.resetValidation();
    if (this.doubleCheckData(index)) return;
    index === undefined ? this.createNewContact() : this.editContact(index);
  }

  resetValidation() {
    this.nameExists = false;
    this.mailExists = false;
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