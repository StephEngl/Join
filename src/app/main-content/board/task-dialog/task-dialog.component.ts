import { Component, Input, Output, EventEmitter, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TaskInfoComponent } from './task-info/task-info.component';
import { AddTaskComponent } from '../../add-task/add-task.component';
import { TasksService } from '../../../services/tasks.service';
import { SingleTaskDataService } from '../../../services/single-task-data.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, TaskInfoComponent, AddTaskComponent],
})
export class TaskDialogComponent {
  taskDataService = inject(SingleTaskDataService);

  @Input() taskDataDialog!: TaskInterface;
  @Input() dialogType: 'add' | 'info' = 'info';
  @Output() close = new EventEmitter<void>();

  constructor(private tasksService: TasksService) { }

  showTaskInfo: boolean = true;
  isEditTaskDialog: boolean = false;

  onEditTask(): void {
    this.taskDataService.editModeActive = true;
    this.isEditTaskDialog = true;
    setTimeout(() => {
      this.showTaskInfo = false;
    }, 10);
  }

  taskEdited(): void {
    this.showTaskInfo = true;
    this.taskDataService.editModeActive = false;
  }


  /* Replaced: this.dialogRef.close() */
  @HostListener('click')
  closeDialog(): void {
    this.close.emit();
    this.taskDataService.editModeActive = false;
    this.isEditTaskDialog = false;
  }

  async deleteTask(): Promise<void> {
    if (this.taskDataDialog && this.taskDataDialog.id) {
      await this.tasksService.deleteTask(this.taskDataDialog.id);
      this.closeDialog();
    }
  }
}
