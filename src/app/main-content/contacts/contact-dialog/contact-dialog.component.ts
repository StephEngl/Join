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
  @Output() update = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() error = new EventEmitter<void>();
  @Output() requestDelete = new EventEmitter<void>();


  @Input() contactName?: string;
  @Input() contactMail?: string;
  @Input() contactPhone?: string;
  @Input() contactIndex?: number | undefined;

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


  // // Simulierter Fehler beim Erstellen

  //   onCreate(index: number | undefined): void {
  //     const { name, mail } = this.contactData;
  //     if (!name.trim() || !mail.trim()) return;
  //     if (index === undefined || index === null) {
  //       this.contactData.color ||= this.contactsService.contactColors[
  //         Math.floor(Math.random() * this.contactsService.contactColors.length)
  //       ];
  //       this.contactsService
  //       .addContact(this.contactData)
  //       .then(() => {
  //         throw new Error('Simulierter Fehler beim Erstellen');
  //       })
  //       .then(() => {
  //         this.create.emit();
  //         this.onCancel();
  //       })
  //       .catch((error) => {
  //         console.error('Fehler beim Speichern:', error);
  //         this.error.emit();
  //       });
  //     } else {
  //       this.editContact(index);
  //     }
  //   }

  onCreate(index: number | undefined): void {
    const { name, mail } = this.contactData;
    if (!name.trim() || !mail.trim()) return;
    index == null ? this.createNewContact() : this.editContact(index);
  }
  
  createNewContact(): void {
    this.contactData.color ||= this.contactsService.contactColors[
      Math.floor(Math.random() * this.contactsService.contactColors.length)
    ];
    this.contactsService.addContact(this.contactData)
      .then(() => { this.create.emit(); this.onCancel(); })
      .catch(() => this.error.emit());
  }
  


  async editContact(index: number) {
    const contact = this.contactsService.contacts[index];
    contact.name = this.contactData.name;
    contact.mail = this.contactData.mail;
    contact.phone = this.contactData.phone;

    if (contact.id) {
      try {
        await this.contactsService.updateContact(contact);
        this.create.emit();
        this.update.emit();
        this.onCancel();
      } catch (error) {
        console.error('Fehler beim Aktualisieren:', error);
        this.error.emit();
      }
    }
  }

}