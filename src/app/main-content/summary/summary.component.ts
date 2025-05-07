import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { TaskInterface } from '../../interfaces/task.interface';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
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
  today: string = new Date().toISOString().split('T')[0]

  urgentTasksCount() {
    const urgentTasksToday = this.tasksService.tasks.filter(task =>
      task.priority === 'urgent' &&
      this.formatDate(task.dueDate) === this.today
    );
    return urgentTasksToday.length;
  }

  formatDate(date: Date | null): string | null {
    return date ? date.toISOString().split('T')[0] : null;
  }

}
