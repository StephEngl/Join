import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  Input,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactInterface } from '../../../interfaces/contact.interface';
import { ContactsService } from '../../../services/contacts.service';

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

  @Input() contactName?: string;
  @Input() contactMail?: string;
  @Input() contactPhone?: string;

  animateIn = false;
  animateOut = false;

  contactData: ContactInterface = {
    name: '',
    mail: '',
    phone: '',
  };

  ngOnInit(): void {
    this.contactData = {
      name: this.contactName || '',
      mail: this.contactMail || '',
      phone: this.contactPhone || '',
    };
    setTimeout(() => (this.animateIn = true), 10);
  }

  ngOnDestroy(): void {
    this.animateIn = false;
    this.animateOut = false;
  }

  onCancel(): void {
    this.animateIn = false;
    this.animateOut = true;
    setTimeout(() => this.cancel.emit(), 400);
  }

  onOverlayClick(): void {
    this.onCancel();
  }

  onCreate(): void {
    const { name, mail } = this.contactData;
    if (!name.trim() || !mail.trim()) return;

    this.contactData.color ||= this.contactsService.contactColors[
      Math.floor(Math.random() * this.contactsService.contactColors.length)
    ];

    this.contactsService
      .addContact(this.contactData)
      .then(() => {
        this.create.emit();
        this.onCancel();
      })
      .catch(() => { });
  }
}