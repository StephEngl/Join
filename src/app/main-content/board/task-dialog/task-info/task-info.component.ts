import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../../interfaces/task.interface';
import { TasksService } from '../../../../services/tasks.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TaskDialogComponent } from '../task-dialog.component';

@Component({
    selector: 'app-task-info',
    templateUrl: './task-info.component.html',
    styleUrls: ['./task-info.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TaskInfoComponent {

    @Input() taskDataDialogInfo!: TaskInterface;
    @Output() editTask = new EventEmitter<void>();

    constructor(
        private tasksService: TasksService,
        private dialogRef: MatDialogRef<TaskDialogComponent>,
        private router: Router
    ) {}

    onEditTask(): void {
        this.editTask.emit();
    }

    async deleteTask(): Promise<void> {
        if (this.taskDataDialogInfo && this.taskDataDialogInfo.id) {
            await this.tasksService.deleteTask(this.taskDataDialogInfo.id);
            this.closeDialog();
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
