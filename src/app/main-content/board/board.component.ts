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
import { Subscription } from 'rxjs';
import { SingleTaskDataService } from '../../services/single-task-data.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ViewChildren, ElementRef, QueryList } from '@angular/core'; //neu hinzugefügt
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
  styleUrls: ['./board.component.scss'],
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
export class BoardComponent {
  tasksService = inject(TasksService);
  singleTaskDataService = inject(SingleTaskDataService);
  searchText: string = '';
  searchActive: boolean = false;

  showTaskDialog: boolean = false;
  showAddTaskDialog: boolean = false;
  isAddTaskDialog: boolean = false;
  selectedTask: TaskInterface | null = null;

  boardColumns: { taskStatus: string; title: string }[] = [
    { taskStatus: 'toDo', title: 'To do' },
    { taskStatus: 'inProgress', title: 'In progress' },
    { taskStatus: 'feedback', title: 'Await feedback' },
    { taskStatus: 'done', title: 'Done' },
  ];

  btnAddHover = false;
  hoveredColumn: string = '';

  @ViewChildren('taskList') taskLists!: QueryList<ElementRef<HTMLElement>>;

  @HostListener('click')
  closeTaskDialog(): void {
    this.showTaskDialog = false;
    this.showAddTaskDialog = false;
    this.isAddTaskDialog = false;
    this.selectedTask = null;
  }

  //TODO: Schatten nach Zoom verschwinden lassen (DOM neu rendern!)
  //FIXME: -
  //BUG: -
  // Aktualisiert die Schatteneffekte der Task-Listen nach dem Fenster Zoom da Scrollhöhen ändern und Schatten sonst falsch angezeigt werden. :)
  @HostListener('window:resize')
  refreshScrollShadowsZoom() {
    setTimeout(() => {
      this.taskLists.forEach(
        (taskList) => this.onTaskListScrollShadow(taskList.nativeElement) // .nativeElement, weil onTaskListScrollShadow auf DOM-Eigenschaften wie offsetHeight zugreift. den sonst ohne nativeElement wäre scrollTop etc. nicht möglihc. ;)
      );
    }, 100);
  }

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
      .filter((task) => task.taskType === status)
      .some(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
      );
  }

  connectedDropLists = this.boardColumns.map((col) => col.taskStatus);

  //TODO: Scroll-Schatten der Aufgabenliste aktualisieren sonst verschwindet der Schatten nicht!
  //FIXME: -
  //BUG: -
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

    // hier neu hinzugefügt bzw. drop erweitert mit um den drop bzw. die funktion erneut zu "rendern", ansonsten wurde in dieser funktion drop() nix umgeschrieben :)
    setTimeout(() => {
      this.taskLists.forEach((listRef) => {
        this.onTaskListScrollShadow(listRef.nativeElement); // beschreibung wie oben
      });
    }, 50);
  }
  // vermerkt für mich... doppelte setTimeOut so wie oben evt. vereinheitlichen!

  openTaskDialog(taskData: TaskInterface): void {
    this.selectedTask = taskData;
    this.showTaskDialog = true;
    this.showAddTaskDialog = false;
  }

  openAddTaskDialog(): void {
    this.showTaskDialog = true;
    this.showAddTaskDialog = true;
    this.isAddTaskDialog = true;
    this.singleTaskDataService.editModeActive = false;
  }

  addTaskWithStatus(taskStatus: string) {
    this.showTaskDialog = true;
    this.showAddTaskDialog = true;
    this.isAddTaskDialog = true;
    this.singleTaskDataService.taskStatus = taskStatus as | 'toDo' | 'inProgress' | 'feedback';
    this.singleTaskDataService.editModeActive = false;
  }

  // TODO: Das problem beheben mit dem Scroll-Schatten der Aufgabenliste wenn nix zu scrollen gibt
  // FIXME: -
  // BUG: -
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
    // math.ceil rundet die zahlen immer auf... z.b. 1.7 wird zu 2 / .floor das gegenteil
    if (Math.ceil(scrollTop + offsetHeight) < Math.floor(scrollHeight)) {
      boardColumn.classList.add('scrolled-bottom');
    } else {
      boardColumn.classList.remove('scrolled-bottom');
    }
  }

  //TODO: Evt. auch ein .ceil...
  //FIXME: -
  //BUG: -
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
