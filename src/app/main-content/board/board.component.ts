import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { TaskFirebaseTempComponent } from './task-firebase-temp/task-firebase-temp.component';
import { TaskComponent } from './task/task.component';
import { TaskInterface } from '../../interfaces/task.interface';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    TaskFirebaseTempComponent,
    TaskComponent,
    DragDropModule
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  tasksService = inject(TasksService);
  boardColumns = [
    { taskStatus: 'toDo', title: 'To do' },
    { taskStatus: 'inProgress', title: 'In progress' },
    { taskStatus: 'feedback', title: 'Await feedback' },
    { taskStatus: 'done', title: 'Done' }
  ];
  
  //filtering tasks to columns by taskType
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
