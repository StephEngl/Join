import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactsService } from '../../services/contacts.service';


@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactDialogComponent, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

  contactsService = inject(ContactsService);

  showDialog = false;

  toggleDialog() {
    this.showDialog = !this.showDialog;
  }

  handleCreate() {
    this.showDialog = false;
  }


}
