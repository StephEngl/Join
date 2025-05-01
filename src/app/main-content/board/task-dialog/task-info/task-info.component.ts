import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../../interfaces/task.interface';
import { TasksService } from '../../../../services/tasks.service';
// import { MatDialogRef } from '@angular/material/dialog'; /* Removed: no longer closing dialog via MatDialog */
import { Router } from '@angular/router';
// import { TaskDialogComponent } from '../task-dialog.component'; /* Removed: used only for dialogRef injection */
import { ContactsService } from '../../../../services/contacts.service';

@Component({
    selector: 'app-task-info',
    templateUrl: './task-info.component.html',
    styleUrls: ['./task-info.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TaskInfoComponent {

    contactsService = inject(ContactsService);
    @Input() taskDataDialogInfo!: TaskInterface;
    @Output() editTask = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    constructor(
        private tasksService: TasksService,
        private router: Router
        /* private dialogRef: MatDialogRef<TaskDialogComponent> */
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
        this.close.emit(); // replaced dialogRef.close()
    }
}
