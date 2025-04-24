import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyResetService } from '../../../services/daily-reset.service';
import { TasksService } from '../../../services/tasks.service';
import { ContactsService } from '../../../services/contacts.service';
import { TaskInterface } from '../../../interfaces/task.interface';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-task-firebase-temp',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './task-firebase-temp.component.html',
  styleUrl: './task-firebase-temp.component.scss'
})
export class TaskFirebaseTempComponent {
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

  // extracting each taskStatus from boardColumns
  connectedDropLists = this.boardColumns.map(col => col.taskStatus);

  //cdk drag & drop method connected to firebase
  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.taskType = event.container.id as TaskInterface['taskType'];
      this.tasksService.updateTask(task);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
