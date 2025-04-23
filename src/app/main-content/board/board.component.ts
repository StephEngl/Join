import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { TaskFirebaseTempComponent } from './task-firebase-temp/task-firebase-temp.component';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskFirebaseTempComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  tasksService = inject(TasksService);

}
