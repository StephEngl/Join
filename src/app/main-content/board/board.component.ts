import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { TaskFirebaseTempComponent } from './task-firebase-temp/task-firebase-temp.component';
import { TaskComponent } from './task/task.component';
import { TaskInterface } from '../../interfaces/task.interface';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskFirebaseTempComponent, TaskComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  tasksService = inject(TasksService);
  boardColumns = [
    { key: 'toDo', title: 'To do' },
    { key: 'inProgress', title: 'In progress' },
    { key: 'feedback', title: 'Await feedback' },
    { key: 'done', title: 'Done' }
  ];
  
  //filtering tasks to columns by taskType
  filterTasksByCategory(status: string): TaskInterface[] {
    return this.tasksService.tasks.filter(task => task.taskType === status);
  }
  
  
  



}
