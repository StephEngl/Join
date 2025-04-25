import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskInterface } from '../../../interfaces/task.interface';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  contactsService = inject(ContactsService);
  @Input() taskData!: TaskInterface;
  @Input() searchRequest: string = "";
  @Output() searchedTitle: EventEmitter<string> = new EventEmitter();


  doesContactExist(contactId: string): boolean {
    return this.contactsService.contacts.some(c => c.id === contactId);
  }
}
