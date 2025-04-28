import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskInterface } from '../../../interfaces/task.interface';
import { ContactsService } from '../../../services/contacts.service';
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  contactsService = inject(ContactsService);
  tasksService = inject(TasksService);
  @Input() taskData!: TaskInterface;
  @Input() searchRequest: string = "";
  @Output() searchedTitle: EventEmitter<string> = new EventEmitter();

  progress: number = 0;  // Der Fortschritt in Prozent
  completed: number = 0;  // Anzahl der erledigten Schritte
  total: number = 10;  // Die Gesamtzahl der Schritte

  constructor() {
    this.updateProgress();
  }

  doesContactExist(contactId: string): boolean {
    return this.contactsService.contacts.some(c => c.id === contactId);
  }

  updateProgress() {
    this.completed = 4;
    this.total = 10;
    this.progress = (this.completed / this.total) * 100;
  }

  allubtasks(taskDataId: string) {
    const taskRef = this.tasksService.tasks.find(task => task.id === taskDataId);
    return taskRef!.subTasks;
  }

  filteredSubtasks(taskDataId: string) {
    const taskRef = this.tasksService.tasks.find(task => task.id === taskDataId);
    return taskRef!.subTasks.filter(subtask => subtask.isChecked == true);
  }
}
