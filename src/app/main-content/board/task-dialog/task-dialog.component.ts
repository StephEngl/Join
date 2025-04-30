import { Component, Input, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TaskInfoComponent } from './task-info/task-info.component';
import { AddTaskComponent } from '../../add-task/add-task.component';
import { TasksService } from '../../../services/tasks.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SingleTaskDataService } from '../../../services/single-task-data.service';

@Component({
    selector: 'app-task-dialog',
    templateUrl: './task-dialog.component.html',
    styleUrls: ['./task-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TaskInfoComponent,
        AddTaskComponent
    ]
})
export class TaskDialogComponent { 

    taskDataService = inject(SingleTaskDataService);
    @Input() taskDataDialog!: TaskInterface;

    constructor(private tasksService: TasksService,
                private dialogRef: MatDialogRef<TaskDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: TaskInterface
            ) {}

    showTaskInfo: boolean = true;

    onEditTask(): void {
        this.taskDataService.editModeActive = true;
        setTimeout(() => {
            this.showTaskInfo = false;
        }, 10);
    }

    onCancelEditTask(): void {
        this.showTaskInfo = true;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    async deleteTask(): Promise<void> {
        if (this.taskDataDialog && this.taskDataDialog.id) {
            await this.tasksService.deleteTask(this.taskDataDialog.id);
            this.closeDialog();
        }
    }
}
