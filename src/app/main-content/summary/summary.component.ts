import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { TaskInterface } from '../../interfaces/task.interface';

//TODO: implent authentication service for user name ☺
// import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  // userName: string = 'Guest';

  constructor(private router: Router) {}

  // constructor(private router: Router, private authService: AuthenticationService) {}

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

    // this.authService.onAuthStateChanged().then(user => {
    //   this.userName = user?.displayName || 'Guest';
    // });

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

  textChangeTime(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) return 'Good morning';
    if (hour >= 9 && hour < 11) return 'Good forenoon';
    if (hour >= 11 && hour < 13) return 'Good midday';
    if (hour >= 13 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  }


}
