import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SingleTaskDataService } from '../../../services/single-task-data.service';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TasksService } from '../../../services/tasks.service';
import { SignalsService } from '../../../services/signals.service';

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [FormsModule, CommonModule],
  host: { class: 'task-overview' },
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss',
})

/**
 * Displays a task overview with optional edit functionality.
 * Allows editing title, description, and due date if edit mode is active.
 */
export class TaskOverviewComponent {
  taskDataService = inject(SingleTaskDataService);
  tasksService = inject(TasksService);
  signalService = inject(SignalsService);

  @Input() taskData!: TaskInterface;
  @Input() today: string = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.setFormData();
  }

  /** Returns the index of the current task or -1 if not found. */
  taskIndex(): number {
    if (this.taskData && this.taskData.id) {
      const index = this.tasksService.findIndexById(this.taskData.id);
      if (index !== -1) {
        return index;
      }
    }
    return -1;
  }

  /** Sets form fields from task data if in edit mode. */
  setFormData() {
    if (this.taskDataService.editModeActive) {
      this.taskDataService.inputTaskTitle = this.taskData.title;
      this.taskDataService.inputTaskDescription = this.taskData.description;
      this.taskDataService.inputTaskDueDate = this.taskData.dueDate;
    }
  }

  /** Updates task's due date directly. */
  onDueDateEditChange(value: string) {
    this.tasksService.tasks[this.taskIndex()].dueDate = new Date(value);
  }

  /** Updates due date in the input form. */
  onDueDateChange(value: string) {
    this.taskDataService.inputTaskDueDate = new Date(value);
  }

  /** Formats a Date to YYYY-MM-DD or returns null. */
  formatDate(date: Date | null): string | null {
    return date ? date.toISOString().split('T')[0] : null;
  }
}
