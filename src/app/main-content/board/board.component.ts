import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { TaskComponent } from './task/task.component';
import { TaskInterface } from '../../interfaces/task.interface';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { AddTaskComponent } from '../add-task/add-task.component';
import { SingleTaskDataService } from '../../services/single-task-data.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ViewChildren, ElementRef, QueryList } from '@angular/core';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    TaskComponent,
    TaskDialogComponent,
    DragDropModule,
    FormsModule,
    AddTaskComponent,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', './board-media.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})

/**
 * The `BoardComponent` represents a Kanban-like task board that supports
 * task filtering, drag-and-drop reordering, responsive behavior, and task dialogs.
 */
export class BoardComponent {

  tasksService = inject(TasksService);
  singleTaskDataService = inject(SingleTaskDataService);
  @ViewChildren('taskList') taskLists!: QueryList<ElementRef<HTMLElement>>;
  searchText: string = '';
  searchActive: boolean = false;
  isMobile = 'ontouchstart' in window || window.innerWidth <= 830;
  showTaskDialog: boolean = false;
  showAddTaskDialog: boolean = false;
  isAddTaskDialog: boolean = false;
  selectedTask: TaskInterface | null = null;
  btnAddHover = false;
  hoveredColumn: string = '';
  boardColumns: { taskStatus: string; title: string }[] = [
    { taskStatus: 'toDo', title: 'To do' },
    { taskStatus: 'inProgress', title: 'In progress' },
    { taskStatus: 'feedback', title: 'Await feedback' },
    { taskStatus: 'done', title: 'Done' },
  ];
  /** Array of task statuses used to connect drop lists */
  connectedDropLists = this.boardColumns.map((col) => col.taskStatus);

  /** Closes all open dialogs and resets selection state. */
  @HostListener('click')
  closeTaskDialog(): void {
    this.showTaskDialog = false;
    this.showAddTaskDialog = false;
    this.isAddTaskDialog = false;
    this.selectedTask = null;
  }


  /** Called on window resize; updates mobile flag and shadow UI. */
  @HostListener('window:resize')
  setDataOnWindowResize() {
    this.checkIsMobile();
    this.refreshShadow();
  }

  /** Refreshes the scroll shadows after a short delay. */
  refreshShadow() {
    this.updateAllScrollShadows(100);
  }

  /** Checks the current viewport width and updates the mobile state. */
  checkIsMobile() {
    this.isMobile = window.innerWidth <= 830;
  }

  /**
   * Filters tasks by given column status and sorts them by priority.
   * @param status - Task type/category (e.g., 'toDo', 'done')
   * @returns Sorted list of tasks in this category
   */
  filterTasksByCategory(status: string): TaskInterface[] {
    return this.tasksService.tasks
      .filter((task) => task.taskType === status)
      .sort((a, b) => {
        const priorityOrder = { urgent: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  /**
   * Determines if there are search results for a given column.
   * @param status - Column status to filter by
   * @param searchText - The string to search for
   * @returns Whether any task in that category matches the query
   */
  hasSearchResults(status: string, searchText: string): boolean {
    const search = searchText.toLowerCase();
    return this.tasksService.tasks
      .filter((task) => task.taskType === status)
      .some(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
      );
  }

  /**
   * Handles drag-and-drop behavior within and across columns.
   * @param event - Drag drop event containing source and target info
   */
  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.placeItemToNewColumn(event);
    }
    this.updateAllScrollShadows(50);
  }

  /**
   * Moves a task to a new column and updates its taskType.
   * @param event - Drag drop event with task data
   */
  placeItemToNewColumn(event: CdkDragDrop<TaskInterface[]>) {
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

  /**
   * Updates scroll shadow styles on all columns with optional delay.
   * @param delay - Time to wait before applying shadows in ms
   */
  updateAllScrollShadows(delay: number = 0): void {
    setTimeout(() => {
      this.taskLists.forEach((listRef) =>
        this.onTaskListScrollShadow(listRef.nativeElement)
      );
    }, delay);
  }

  /**
   * Opens the detail dialog for the given task.
   * @param taskData - Task to display
   */
  openTaskDialog(taskData: TaskInterface): void {
    this.selectedTask = taskData;
    this.showTaskDialog = true;
    this.showAddTaskDialog = false;
  }

  /**
   * Opens the dialog to create a new task.
   */
  openAddTaskDialog(): void {
    this.showTaskDialog = true;
    this.showAddTaskDialog = true;
    this.isAddTaskDialog = true;
    this.singleTaskDataService.editModeActive = false;
  }

  /**
   * Opens the add task dialog and sets the status for the new task.
   * @param taskStatus - Status to assign to the new task
   */
  addTaskWithStatus(taskStatus: string) {
    this.showTaskDialog = true;
    this.showAddTaskDialog = true;
    this.isAddTaskDialog = true;
    this.singleTaskDataService.taskStatus = taskStatus as | 'toDo' | 'inProgress' | 'feedback';
    this.singleTaskDataService.editModeActive = false;
  }

  /**
   * Applies top and bottom scroll shadow classes to a column.
   * @param taskList - The scrollable task list element
   */
  onTaskListScrollShadow(taskList: HTMLElement) {
    const boardColumn = taskList.closest('.board-column');
    if (!boardColumn) return;
    this.setShadowClasses(taskList, boardColumn);
  }

  /**
   * Sets scroll shadow classes based on element scroll position.
   * @param taskList - Scrollable list
   * @param boardColumn - Container element
   */
  setShadowClasses(taskList: HTMLElement, boardColumn: any) {
    if (taskList.scrollTop > 0) {
      boardColumn.classList.add('scrolled-top');
    } else {
      boardColumn.classList.remove('scrolled-top');
    }
    if (Math.ceil(taskList.scrollTop + taskList.offsetHeight) < Math.floor(taskList.scrollHeight)) {
      boardColumn.classList.add('scrolled-bottom');
    } else {
      boardColumn.classList.remove('scrolled-bottom');
    }
  }

  /**
   * Applies left and right scroll shadow classes (for mobile).
   * @param taskList - The scrollable horizontal list element
   */
  onTaskListScrollShadowMobile(taskList: HTMLElement) {
    if (taskList.scrollLeft > 0) {
      taskList.classList.add('scrolled-left');
    } else {
      taskList.classList.remove('scrolled-left');
    }
    if (taskList.scrollLeft + taskList.offsetWidth < taskList.scrollWidth - 1) {
      taskList.classList.add('scrolled-right');
    } else {
      taskList.classList.remove('scrolled-right');
    }
  }

  /** Triggers the search animation temporarily. */
  triggerSearch() {
    this.searchActive = true;
    setTimeout(() => {
      this.searchActive = false;
    }, 50);
  }

  /**
   * Updates a task's column by ID and new type.
   * @param event - Contains task ID and the new type
   */
  updateTaskColumn(event: { id: string; newType: TaskInterface['taskType'] }) {
    const task = this.tasksService.tasks.find((task) => task.id === event.id);
    if (task) {
      task.taskType = event.newType;
      this.tasksService.updateTask(task);
    }
  }

}
