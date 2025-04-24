import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyResetService } from '../../../services/daily-reset.service';
import { TasksService } from '../../../services/tasks.service';
import { ContactsService } from '../../../services/contacts.service';
import { TaskInterface } from '../../../interfaces/task.interface';

@Component({
  selector: 'app-task-firebase-temp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-firebase-temp.component.html',
  styleUrl: './task-firebase-temp.component.scss'
})
export class TaskFirebaseTempComponent {
  // dailyReset = inject(DailyResetService);
  tasksService = inject(TasksService);
  contactsService = inject(ContactsService);
  boardColumns = [
    { taskStatus: 'toDo', title: 'To do' },
    { taskStatus: 'inProgress', title: 'In progress' },
    { taskStatus: 'feedback', title: 'Await feedback' },
    { taskStatus: 'done', title: 'Done' }
  ];

    filterTasksByCategory(status: string): TaskInterface[] {
      return this.tasksService.tasks.filter(task => task.taskType === status);
    }
}
