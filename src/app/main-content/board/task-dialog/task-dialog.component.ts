import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TasksService } from '../../../services/tasks.service';
import { TaskInfoComponent } from './task-info/task-info.component';
import { AddTaskComponent } from '../../add-task/add-task.component';

@Component({
    selector: 'app-task-dialog',
    standalone: true,
    templateUrl: './task-dialog.component.html',
    styleUrls: ['./task-dialog.component.scss'],
    imports: [CommonModule, TaskInfoComponent, AddTaskComponent]
})
export class TaskDialogComponent implements OnInit {
    task!: TaskInterface;

    constructor(
        private route: ActivatedRoute,
        private tasksService: TasksService
    ) {}

    ngOnInit(): void {
        const taskId = this.route.snapshot.paramMap.get('id');
        if (taskId) {
            this.task = this.tasksService.getTaskById(taskId);
        }
    }
}
