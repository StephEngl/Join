import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskInterface } from '../../../../interfaces/task.interface';
import { TasksService } from '../../../../services/tasks.service';
import { Router } from '@angular/router';
import { ContactsService } from '../../../../services/contacts.service';

@Component({
    selector: 'app-task-info',
    templateUrl: './task-info.component.html',
    styleUrls: ['./task-info.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class TaskInfoComponent {

    contactsService = inject(ContactsService);
    @Input() taskDataDialogInfo!: TaskInterface;
    @Output() editTask = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    constructor(
        private tasksService: TasksService,
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

    async checkSubTask(): Promise<void> {
        if (this.taskDataDialogInfo?.id) {
            await this.tasksService.updateTask(this.taskDataDialogInfo);
        }
    }

    closeDialog(): void {
        this.close.emit(); // replaced dialogRef.close()
    }
}
