import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TaskInfoComponent } from './task-info/task-info.component';
import { AddTaskComponent } from '../../add-task/add-task.component';
import { TasksService } from '../../../services/tasks.service';
import { SingleTaskDataService } from '../../../services/single-task-data.service';
import { SignalsService } from '../../../services/signals.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, TaskInfoComponent, AddTaskComponent],
})

/**
 * TaskDialogComponent displays a modal dialog for task operations,
 * supporting viewing, editing, and deleting a task.
 */
export class TaskDialogComponent {
  signalService = inject(SignalsService);
  taskDataService = inject(SingleTaskDataService);
  showTaskInfo: boolean = true;
  isEditTaskDialog: boolean = false;
  @Input() taskDataDialog!: TaskInterface;
  @Input() dialogType: 'add' | 'info' = 'info';
  @Output() close = new EventEmitter<void>();

  constructor(private tasksService: TasksService) {}

  /**
 * Angular lifecycle hook.
 * Called once by Angular, after the component's inputs are assigned but before the view is rendered.
 * - If images exist in the provided `taskDataDialog`, sets these as the current gallery images via the signal service.
 * - If no images exist, ensures the gallery is reset to an empty state.
 */
  ngOnInit(): void {
    if (this.taskDataDialog && this.taskDataDialog.images) {
      this.signalService.setTaskImages(this.taskDataDialog.images);
    } else {
      this.signalService.setTaskImages([]);
    }
  }

  /**
   * Closes the dialog when clicking outside and resets edit state.
   * Triggered by host click event.
   */
  @HostListener('click')
  closeDialog(): void {
    this.close.emit();
    this.taskDataService.editModeActive = false;
    this.isEditTaskDialog = false;
    this.signalService.clearTaskImages();
  }

  /**
   * Handles transitioning into task edit mode using SRP-conform helper functions.
   */
  onEditTask(): void {
    const latestTask = this.getLatestTask();
    // Update dialog data binding with the latest task object.
    this.taskDataDialog = latestTask!;
    // Initialize the gallery with the new task's images.
    this.initializeGalleryImages(latestTask);
    // Activate edit mode in component state.
    this.activateEditMode();
  }

  /**
 * Retrieves the latest task object from the TasksService based on the task ID.
 * @returns The latest TaskInterface object or undefined if not found.
 */
private getLatestTask(): TaskInterface | undefined {
  return this.tasksService.tasks.find(
    (t) => t.id === this.taskDataDialog.id
  );
}

/**
 * Initializes the gallery with the images from the provided task object.
 * If no images exist, it clears the gallery images.
 * @param task The TaskInterface object containing images.
 */
private initializeGalleryImages(task: TaskInterface | undefined): void {
  if (task && task.images) {
    this.signalService.setTaskImages(task.images);
  } else {
    this.signalService.setTaskImages([]);
  }
}

/**
 * Activates edit mode in the component state.
 */
private activateEditMode(): void {
  this.taskDataService.editModeActive = true;
  this.isEditTaskDialog = true;
  setTimeout(() => {
    this.showTaskInfo = false;
  }, 10);
}

  /**
   * Callback for when a task has been edited.
   * Resets the view back to info mode.
   */
  taskEdited(): void {
    this.showTaskInfo = true;
    this.taskDataService.editModeActive = false;
    this.isEditTaskDialog = false;
  }

  /**
   * Deletes the current task and closes the dialog.
   * @returns A promise that resolves after deletion.
   */
  async deleteTask(): Promise<void> {
    if (this.taskDataDialog && this.taskDataDialog.id) {
      await this.tasksService.deleteTask(this.taskDataDialog.id);
      this.closeDialog();
    }
  }
}
