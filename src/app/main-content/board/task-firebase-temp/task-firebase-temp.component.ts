import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../../services/tasks.service';
import { TaskInterface } from '../../../interfaces/task.interface';
import { ContactsService } from '../../../services/contacts.service';
import { DummyTasksService } from '../../../services/dummy-tasks.service';

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
  dummyTaskService = inject(DummyTasksService);
  taskCategories = [
    { taskType: 'toDo', label: 'ToDo' },
    { taskType: 'inProgress', label: 'In Progress' },
    { taskType: 'feedback', label: 'Await Feedback' },
    { taskType: 'done', label: 'Done' }
  ];

  filterTasksByCategory(category: string): TaskInterface[] {
    return this.tasksService.tasks.filter(task => task.taskType === category);
  }

  createContact() {
    this.dummyTaskService.dummyTasks.forEach((task) => {
      this.tasksService.addTask(task);
    })
  }

  nameInitials(id: string | undefined) {
    const contact = this.contactsService.contacts.find(c => c.id === id);
    const parts = contact?.name.trim().split(' ') || [];
    const nameLetter1 = contact?.name.charAt(0).toUpperCase() || '';
    const lastName = parts?.at(-1) || '';
    const lastNameLetter = lastName.charAt(0).toUpperCase();
    return nameLetter1 + lastNameLetter;
  }

}
