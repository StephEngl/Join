import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { TaskFirebaseTempComponent } from './task-firebase-temp/task-firebase-temp.component';
import { TaskComponent } from './task/task.component';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskFirebaseTempComponent, TaskComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  tasksService = inject(TasksService);
  
}
