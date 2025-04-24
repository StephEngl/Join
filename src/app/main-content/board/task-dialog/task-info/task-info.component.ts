import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../../interfaces/task.interface';
import { TaskDialogComponent } from '../task-dialog.component';

@Component({
    selector: 'app-task-info',
    standalone: true,
    imports: [CommonModule, TaskDialogComponent],
    templateUrl: './task-info.component.html',
    styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent {
    @Input() task!: TaskInterface;
    @Output() close = new EventEmitter<void>();

    taskInfo_closeDialog(): void {
        this.close.emit();
    }

    constructor(private dialog: MatDialog) {}

    openEditTaskDialog() {
        this.dialog.open(TaskDialogComponent);
    }
}
