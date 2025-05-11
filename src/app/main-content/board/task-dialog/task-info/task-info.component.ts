import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskInterface } from '../../../../interfaces/task.interface';
import { TasksService } from '../../../../services/tasks.service';
import { Router } from '@angular/router';
import { ContactsService } from '../../../../services/contacts.service';
import { ToastService } from '../../../../services/toast.service';

import { SignalsService } from '../../../../services/signals.service';

@Component({
    selector: 'app-task-info',
    templateUrl: './task-info.component.html',
    styleUrls: ['./task-info.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule],
    })

    /**
     * Displays task details in a dialog, with options to edit or delete the task.
     */
    export class TaskInfoComponent {
    contactsService = inject(ContactsService);
    toastService = inject(ToastService);
    signalsService = inject(SignalsService);
    tasksService = inject(TasksService);
    @Input() taskDataDialogInfo!: TaskInterface;
    @Output() editTask = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    constructor(private router: Router) {}

    /** Emits the edit event. */
    onEditTask(): void {
        this.editTask.emit();
    }

    /** Returns the index of the current task, or -1 if not found. */
    taskIndex(): number {
        if (this.taskDataDialogInfo && this.taskDataDialogInfo.id) {
            const index = this.tasksService.findIndexById(this.taskDataDialogInfo.id);
        if (index !== -1) {
            return index;
        }
        }
        return -1;
    }

    /** Deletes the current task and closes the dialog. */
    async deleteTask(): Promise<void> {
        if (this.taskDataDialogInfo && this.taskDataDialogInfo.id) {
            await this.tasksService.deleteTask(this.taskDataDialogInfo.id);
            this.closeDialog();
        }
        this.toastService.triggerToast(
        'Deleted from board',
        'delete',
        'assets/icons/navbar/board.svg'
        );
    }

    /** Updates the task state (e.g., on subtask changes). */
    async checkSubTask(): Promise<void> {
        if (this.taskDataDialogInfo?.id) {
            await this.tasksService.updateTask(this.taskDataDialogInfo);
        }
    }

    /** Emits the close event. */
    closeDialog(): void {
        this.close.emit();
    }

    /** Checks if a contact exists by ID. */
    doesContactExist(contactId: string): boolean {
        return this.contactsService.contacts.some((c) => c.id === contactId);
    }

    /** Returns up to 4 existing assigned contacts. */
    showLimitedContact(): TaskInterface['assignedTo'] {
        return this.tasksService.tasks[this.taskIndex()].assignedTo
        .filter((c) => this.doesContactExist(c.contactId))
        .slice(0, 4);
    }
}
