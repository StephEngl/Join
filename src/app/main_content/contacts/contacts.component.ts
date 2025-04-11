import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { ContactsService } from '../../services/contacts.service';
import { ContactInterface } from '../../interfaces/contact.interface';


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

  sortedContacts: ContactInterface[] = [];

ngOnInit() {
  this.sortList();
}

sortList() {
  this.sortedContacts = this.contactsService.contacts.sort((a, b) =>
    a.name.localeCompare(b.name)
  );


  this.sortedContacts.forEach((contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    console.log('letterleertt ' + letter + ' - ' + contact.name);
  });
}


}
