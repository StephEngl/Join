import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  constructor(private router: Router) {}

  tasksService = inject(TasksService);
  taskColumns: { text: string; taskCount: number }[] = [];

  ngOnInit() {
    this.taskColumns = [
      {
        text: 'Tasks in<br>Board',
        taskCount: this.tasksCount(),
      },
      {
        text: 'Tasks In<br>Progress',
        taskCount: this.tasksByType('inProgress'),
      },
      {
        text: 'Awaiting<br>Feedback',
        taskCount: this.tasksByType('feedback'),
      }
    ];
  }

  toBoard() {
    this.router.navigate(['/board']);
  }

  tasksCount() {
    return this.tasksService.tasks.length;
  }

  tasksByType(typeInput: string): number {
    return this.tasksService.tasks.filter(task => task.taskType === typeInput).length;
  }

  tasksByPriority(priorityInput: string): number {
    return this.tasksService.tasks.filter(task => task.priority === priorityInput).length;
  }
  
}
