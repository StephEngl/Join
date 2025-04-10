import { Component, inject } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

  contactRef = inject(ContactsService);
  
}
