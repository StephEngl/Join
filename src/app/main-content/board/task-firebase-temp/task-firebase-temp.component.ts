import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../../services/tasks.service';
import { TaskInterface } from '../../../interfaces/task.interface';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-task-firebase-temp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-firebase-temp.component.html',
  styleUrl: './task-firebase-temp.component.scss'
})
export class TaskFirebaseTempComponent {
  tasksService = inject(TasksService);
  contactsService = inject(ContactsService);

  createContact() {
    const task: TaskInterface = {
      title: 'Design Landing Page',
      description: 'Erstelle eine erste Version der Landing Page',
      category: 'Design',
      dueDate: new Date('2025-05-01'),
      priority: 'high',
      subTasks: ['Header layout bauen', 'Farbschema wählen'],
      assignedTo: [
        { contactId: '0ynBkOGNOyokozUqJiED' },
        { contactId: 'i0jenjourf0WRSr9S8eA' }
      ],
      taskType: 'toDo' // hier auch :) (Soll ja nach dem erstellen ins toDo verschoben werden)
    };
    this.tasksService.addTask(task)
  }


  nameInitials(id: string | undefined) {
    const contact = this.contactsService.contacts.find(c => c.id === id);
    const parts = contact?.name.trim().split(' ');
    const preNameLetter = contact?.name.charAt(0).toUpperCase() || '';
    const lastWord = parts?.at(-1) || '';
    const surNameLetter = lastWord.charAt(0).toUpperCase()
    return preNameLetter + surNameLetter;
  }
}

// assignedTo.find(contact => contact.contactId === id)