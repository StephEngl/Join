import { Component, inject, Input } from '@angular/core';
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
}
