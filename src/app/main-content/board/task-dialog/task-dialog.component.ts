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

  /** Enables edit mode and switches view after a short delay. */
  onEditTask(): void {
    if (this.taskDataDialog && this.taskDataDialog.images) {
      this.signalService.setTaskImages(this.taskDataDialog.images);
    } else {
      this.signalService.setTaskImages([]);
    }
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
