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
  styleUrl: './summary.component.scss',
})

/**
 * SummaryComponent displays an overview of the user's tasks and current day information.
 * Includes greeting logic, task statistics, and navigation to the task board.
 */
export class SummaryComponent {

  constructor(private router: Router) { }

  showWelcome = false;
  fadeOutWelcome = false;

  tasksService = inject(TasksService);
  authService = inject(AuthenticationService);
  userName: string | null = null;
  today: string = this.formatDate(new Date())!;
  taskOverviewBottom: { text: string }[] = [
    {
      text: 'Tasks in<br>Board',
    },
    {
      text: 'Tasks In<br>Progress',
    },
    {
      text: 'Awaiting<br>Feedback',
    },
  ];
  taskOverviewTop: {
    type: string;
    text: string;
    icon: string;
    iconHovered: string;
    isHovered: boolean;
  }[] = [
      {
        type: 'toDo',
        text: 'To-Do',
        icon: './assets/icons/general/edit_white.svg',
        iconHovered: './assets/icons/general/edit.svg',
        isHovered: false,
      },
      {
        type: 'done',
        text: 'Done',
        icon: './assets/icons/general/check_white.svg',
        iconHovered: './assets/icons/general/check.svg',
        isHovered: false,
      },
    ];

  /**
* Initializes task data and user name.
* Shows and fades out welcome message on mobile.
*/
  ngOnInit() {
    this.tasksService.loadTasks();
    this.authService.showActiveUserName();
    if (window.innerWidth < 1000) {
      this.showWelcome = true;
      setTimeout(() => {
        this.fadeOutWelcome = true;
      }, 2000);
      setTimeout(() => {
        this.showWelcome = false;
        this.fadeOutWelcome = false;
      }, 3000);
    }
  }

  /** Navigates to the task board view. */
  toBoard() {
    this.router.navigate(['/board']);
  }

  /**
   * Returns number of urgent tasks due today.
   * @returns Count of urgent tasks with due date matching today.
   */
  urgentTasksCount() {
    const urgentTasksToday = this.tasksService.tasks.filter(
      (task) =>
        task.priority === 'urgent' &&
        this.formatDate(task.dueDate) === this.today
    );
    return urgentTasksToday.length;
  }

  /**
   * Formats a given date to 'Month Day, Year' format.
   * @param date - A Date object or null.
   * @returns A formatted string or null.
   */
  formatDate(date: Date | null): string | null {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  /**
   * Returns a greeting based on current hour.
   * @returns A string like "Good morning" or "Good evening".
   */
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
