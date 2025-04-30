import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { TaskFirebaseTempComponent } from './task-firebase-temp/task-firebase-temp.component';
import { TaskComponent } from './task/task.component';
import { TaskInterface } from '../../interfaces/task.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
    TaskFirebaseTempComponent,
    TaskComponent,
    DragDropModule,
    FormsModule,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  tasksService = inject(TasksService);
  singleTaskDataService = inject(SingleTaskDataService);
  searchText: string = '';
  boardColumns: { taskStatus: string; title: string }[] = [
    { taskStatus: 'toDo', title: 'To do' },
    { taskStatus: 'inProgress', title: 'In progress' },
    { taskStatus: 'feedback', title: 'Await feedback' },
    { taskStatus: 'done', title: 'Done' },
  ];

  btnAddHover = false;

  hoveredColumn: string = '';
  private dialogRef: MatDialogRef<AddTaskComponent> | null = null;
  private breakpointSub: Subscription | null = null;

  constructor(private dialog: MatDialog, private breakpointObserver: BreakpointObserver) { }

  // tasks filtered by taskType & sorted by Priority
  filterTasksByCategory(status: string): TaskInterface[] {
    return this.tasksService.tasks
      .filter((task) => task.taskType === status)
      .sort((a, b) => {
        const priorityOrder = { urgent: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  // extracting each taskStatus from boardColumns
  connectedDropLists = this.boardColumns.map((col) => col.taskStatus);

  // /* Inject Angular Material Dialog */
  // private dialog = inject(MatDialog);

  /* Handles the drag & drop logic and updates Firebase */
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

  /* Opens the task dialog as an overlay and passes the clicked task as data */
  openTaskDialog(taskData: TaskInterface): void {
    this.dialog.open(TaskDialogComponent, {
      data: taskData,
      width: '525px',
      maxHeight: '90vW',
      panelClass: 'task-dialog-overlay',
    });
  }

  openAddTaskDialog(): void {
    this.singleTaskDataService.editModeActive = false; // needed to trigger add-task form
    this.dialogRef = this.dialog.open(AddTaskComponent, {
      width: '1116px',
      maxWidth: '80vw',
      panelClass: 'add-task-dialog-responsive',
    });

    // Breakpoint-Observable abonnieren
    this.breakpointSub = this.breakpointObserver
      .observe('(max-width: 550px)')
      .subscribe(result => {
        if (this.dialogRef) {
          if (result.matches) {
            this.dialogRef.updateSize('98vw');
          } else {
            this.dialogRef.updateSize('1116px');
          }
        }
      });

    // Nach dem Schließen des Dialogs das Abo aufräumen
    this.dialogRef.afterClosed().subscribe(() => {
      if (this.breakpointSub) {
        this.breakpointSub.unsubscribe();
        this.breakpointSub = null;
      }
    });
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


}
