import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TaskInfoComponent } from './task-info/task-info.component';
import { AddTaskComponent } from '../../add-task/add-task.component';
import { TasksService } from '../../../services/tasks.service';
import { MatDialogRef } from '@angular/material/dialog';

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

    @Input() taskDataDialog!: TaskInterface;

    constructor(private tasksService: TasksService, private dialogRef: MatDialogRef<TaskDialogComponent>) {}

    showTaskInfo: boolean = true;

    onEditTask(): void {
        this.showTaskInfo = false;
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
