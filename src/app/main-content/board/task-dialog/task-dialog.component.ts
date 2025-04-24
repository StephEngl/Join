import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TaskInfoComponent } from './task-info/task-info.component';
import { AddTaskComponent } from '../../add-task/add-task.component';
import { TasksService } from '../../../services/tasks.service';

@Component({
    selector: 'app-task-dialog',
    standalone: true,
    imports: [CommonModule, TaskInfoComponent, AddTaskComponent],
    templateUrl: './task-dialog.component.html',
    styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {
    @Input() task!: TaskInterface;

    constructor(private tasksService: TasksService) {}

    updateTaskInDialog(updatedTask: TaskInterface): void {
        this.tasksService.updateTask(updatedTask);
    }
}
