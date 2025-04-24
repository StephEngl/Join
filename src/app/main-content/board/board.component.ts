import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { TaskFirebaseTempComponent } from './task-firebase-temp/task-firebase-temp.component';
import { TaskComponent } from './task/task.component';
import { TaskInterface } from '../../interfaces/task.interface';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
    DragDropModule
} from '@angular/cdk/drag-drop';

/* Import for Angular Material Dialog */
import { MatDialog } from '@angular/material/dialog';
/* Import the standalone dialog component */
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [
        CommonModule,
        TaskFirebaseTempComponent,
        TaskComponent,
        DragDropModule
    ],
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent {
    tasksService = inject(TasksService);

    /* Inject Angular Material Dialog */
    private dialog = inject(MatDialog);

    boardColumns = [
        { taskStatus: 'toDo', title: 'To do' },
        { taskStatus: 'inProgress', title: 'In progress' },
        { taskStatus: 'feedback', title: 'Await feedback' },
        { taskStatus: 'done', title: 'Done' }
    ];

    /* Filters all tasks by their status to populate board columns */
    filterTasksByCategory(status: string): TaskInterface[] {
        return this.tasksService.tasks.filter(task => task.taskType === status);
    }

    /* List of connected droppable zones for drag & drop */
    connectedDropLists = this.boardColumns.map(col => col.taskStatus);

    /* Handles the drag & drop logic and updates Firebase */
    drop(event: CdkDragDrop<TaskInterface[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            const task = event.previousContainer.data[event.previousIndex];
            task.taskType = event.container.id as TaskInterface['taskType'];
            this.tasksService.updateTask(task);
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

    /* Opens the task dialog as an overlay and passes the clicked task as data */
    openTaskDialog(task: TaskInterface): void {
        this.dialog.open(TaskDialogComponent, {
            data: task,
            width: '700px',
            maxHeight: '90vh',
            panelClass: 'task-dialog-overlay'
        });
    }
}
