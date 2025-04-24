import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../../interfaces/task.interface';
import { TasksService } from '../../../../services/tasks.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-task-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './task-info.component.html',
    styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent {
    @Input() task!: TaskInterface;

    constructor(
        private tasksService: TasksService,
        private dialogRef: MatDialogRef<TaskInfoComponent>,
        private router: Router
    ) {}

    closeDialog(): void {
        this.dialogRef.close();
        this.router.navigate(['/board']);
    }

    deleteTask(): void {
        if (this.task?.id) {
            this.tasksService.deleteTask(this.task.id).then(() => {
                this.dialogRef.close();
                this.router.navigate(['/board']);
            });
        }
    }

    editTask(updatedData: Partial<TaskInterface>): void {
        if (this.task?.id) {
            const updatedTask: TaskInterface = {
                ...this.task,
                ...updatedData
            };
            this.tasksService.updateTask(updatedTask).then(() => {
                this.dialogRef.close(updatedTask);
                this.router.navigate(['/board']);
            });
        }
    }
}
