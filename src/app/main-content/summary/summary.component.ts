import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  constructor(private router: Router, private authService: AuthenticationService) { }

  tasksService = inject(TasksService);
  taskOverviewBottom: { text: string; taskCount: number }[] = [];
  userName: string | null = null;

  taskOverviewTop: {
    type: string;
    text: string;
    icon: string;
    iconHovered: string;
    isHovered: boolean
  }[] = [
      {
        type: 'toDo',
        text: 'To-Do',
        icon: './assets/icons/general/edit_white.svg',
        iconHovered: './assets/icons/general/edit.svg',
        isHovered: false
      },
      {
        type: 'done',
        text: 'Done',
        icon: './assets/icons/general/check_white.svg',
        iconHovered: './assets/icons/general/check.svg',
        isHovered: false
      }
    ];

  ngOnInit() {
    this.setOverviewDataBottom();
    this.checkForAuth();
  }

  async checkForAuth() {
    try {
      const user = await this.authService.onAuthStateChanged();
      this.userName = user?.displayName || 'Guest';
    } catch (error) {
      console.error('Error fetching user:', error);
      this.userName = 'Guest';
    }
  }

  setOverviewDataBottom() {
    this.taskOverviewBottom = [
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

  today: string = this.formatDate(new Date())!;
  // today: string = new Date().toISOString().split('T')[0]

  urgentTasksCount() {
    const urgentTasksToday = this.tasksService.tasks.filter(task =>
      task.priority === 'urgent' &&
      this.formatDate(task.dueDate) === this.today
    );
    return urgentTasksToday.length;
  }

  // formatDate(date: Date | null): string | null {
  //   return date ? date.toISOString().split('T')[0] : null;
  // }

  //FIXME: Date name full show Octotber XX, XXXX

  formatDate(date: Date | null): string | null {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
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
