import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { TaskComponent } from './task/task.component';
import { TaskInterface } from '../../interfaces/task.interface';
/* import { MatDialog, MatDialogRef } from '@angular/material/dialog'; */ /* Removed: switched to manual task dialog */
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { FormsModule } from '@angular/forms';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
    DragDropModule,
} from '@angular/cdk/drag-drop';
import { AddTaskComponent } from '../add-task/add-task.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { SingleTaskDataService } from '../../services/single-task-data.service';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [
        CommonModule,
        TaskComponent,
        TaskDialogComponent,
        DragDropModule,
        FormsModule,
        AddTaskComponent
    ],
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    tasksService = inject(TasksService);
    singleTaskDataService = inject(SingleTaskDataService);
    searchText: string = '';
    searchActive: boolean = false;

    showTaskDialog: boolean = false;
    showAddTaskDialog: boolean = false;
    selectedTask: TaskInterface | null = null;

    boardColumns: { taskStatus: string; title: string }[] = [
        { taskStatus: 'toDo', title: 'To do' },
        { taskStatus: 'inProgress', title: 'In progress'},
        { taskStatus: 'feedback', title: 'Await feedback'},
        { taskStatus: 'done', title: 'Done'},
    ];

    btnAddHover = false;
    hoveredColumn: string = '';
    /* private dialogRef: MatDialogRef<AddTaskComponent> | null = null; */ /* Removed: old Material dialog logic */
    private breakpointSub: Subscription | null = null;

    /* constructor(private dialog: MatDialog, private breakpointObserver: BreakpointObserver) { } */
    constructor(private breakpointObserver: BreakpointObserver) { }

    filterTasksByCategory(status: string): TaskInterface[] {
        return this.tasksService.tasks
            .filter((task) => task.taskType === status)
            .sort((a, b) => {
                const priorityOrder = { urgent: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
    }

    hasSearchResults(status: string, searchText: string): boolean {
        const search = searchText.toLowerCase();
        return this.tasksService.tasks
            .filter(task => task.taskType === status)
            .some(task =>
                task.title.toLowerCase().includes(search) ||
                task.description.toLowerCase().includes(search)
            );
    }

    connectedDropLists = this.boardColumns.map((col) => col.taskStatus);

    drop(event: CdkDragDrop<TaskInterface[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
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

    openTaskDialog(taskData: TaskInterface): void {
        this.selectedTask = taskData;
        this.showTaskDialog = true;
    }

    closeTaskDialog(): void {
        this.showTaskDialog = false;
        this.selectedTask = null;
    }

    openAddTaskDialog(): void {
        this.showTaskDialog = true;
        this.showAddTaskDialog = true;
        this.singleTaskDataService.editModeActive = false;
    }

    addTaskWithStatus(taskStatus: string){
        this.showTaskDialog = true;
        this.showAddTaskDialog = true;
        this.singleTaskDataService.taskStatus = taskStatus as 'toDo' | 'inProgress' | 'feedback';
        this.singleTaskDataService.editModeActive = false;
    }

    onTaskListScrollShadow(taskList: HTMLElement) {
        const boardColumn = taskList.closest('.board-column');
        if (!boardColumn) return;
        const scrollTop = taskList.scrollTop;
        const scrollHeight = taskList.scrollHeight;
        const offsetHeight = taskList.offsetHeight;

        if (scrollTop > 0) {
            boardColumn.classList.add('scrolled-top');
        } else {
            boardColumn.classList.remove('scrolled-top');
        }
        if (scrollTop + offsetHeight < scrollHeight - 1) {
            boardColumn.classList.add('scrolled-bottom');
        } else {
            boardColumn.classList.remove('scrolled-bottom');
        }
    }

    onTaskListScrollShadowMobile(taskList: HTMLElement) {
        const scrollLeft = taskList.scrollLeft;
        const scrollWidth = taskList.scrollWidth;
        const offsetWidth = taskList.offsetWidth;
        if (scrollLeft > 0) {
            taskList.classList.add('scrolled-left');
        } else {
            taskList.classList.remove('scrolled-left');
        }
        if (scrollLeft + offsetWidth < scrollWidth - 1) {
            taskList.classList.add('scrolled-right');
        } else {
            taskList.classList.remove('scrolled-right');
        }
    }

    triggerSearch() {
        this.searchActive = true;
        setTimeout(() => {
            this.searchActive = false;
        }, 50);
    }

}