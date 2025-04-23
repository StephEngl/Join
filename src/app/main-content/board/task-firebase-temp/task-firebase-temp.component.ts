import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-task-firebase-temp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-firebase-temp.component.html',
  styleUrl: './task-firebase-temp.component.scss'
})
export class TaskFirebaseTempComponent {
  tasksService = inject(TasksService);
}
