import { Component, EventEmitter, inject, Input, Output, HostListener } from '@angular/core';
import { TaskInterface } from '../../../interfaces/task.interface';
import { ContactsService } from '../../../services/contacts.service';
import { TasksService } from '../../../services/tasks.service';
import { SignalsService } from '../../../services/signals.service';

@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

/**
 * Represents a task card with UI interactions like editing, filtering subtasks,
 * and changing task status.
 */
export class TaskComponent {
  contactsService = inject(ContactsService);
  tasksService = inject(TasksService);
  signalsService = inject(SignalsService);

  @Input() taskData!: TaskInterface;
  @Input() searchRequest: string = "";
  @Input() searchTrigger: boolean = false;
  @Output() searchedTitle: EventEmitter<string> = new EventEmitter();
  @Output() updateTaskType = new EventEmitter<{ id: string; newType: TaskInterface['taskType'] }>();
  @Output() taskClicked = new EventEmitter<TaskInterface>();

  menuOpen = false;

  /** Closes the menu when clicking outside the task card. */
  @HostListener('document:click')
  onClickOutside() {
      this.menuOpen = false;
  }

  /** Checks if a contact ID exists in the contact list. */
  doesContactExist(contactId: string): boolean {
    return this.contactsService.contacts.some(c => c.id === contactId);
  }

  /** Returns all subtasks of a task by ID. */
  allubtasks(taskDataId: string) {
    const taskRef = this.tasksService.tasks.find(task => task.id === taskDataId);
    return taskRef!.subTasks;
  }

  /** Returns only checked subtasks of a task by ID. */
  filteredSubtasks(taskDataId: string) {
    const taskRef = this.tasksService.tasks.find(task => task.id === taskDataId);
    return taskRef!.subTasks.filter(subtask => subtask.isChecked == true);
  }

  /** Returns up to four valid assigned contacts. */
  showLimitedContact(): TaskInterface['assignedTo'] {
    return this.taskData.assignedTo
      .filter(c => this.doesContactExist(c.contactId))
      .slice(0, 4);
  }

  /** Returns the number of additional assigned contacts beyond the first four. */
  overflowCount(): number {
    const validContacts = this.taskData.assignedTo
      .filter(c => this.doesContactExist(c.contactId));
    return validContacts.length > 4 ? validContacts.length - 4 : 0;
  }

  /** Toggles the task context menu. */
  toggleTaskMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  /** Emits the new task type when task is moved to another column. */
  moveTaskTo(newType: TaskInterface['taskType']) {
    if (this.taskData.id) {
      this.updateTaskType.emit({ id: this.taskData.id, newType });
      this.menuOpen = false;
    }
    this.menuOpen = false;
  }

  /** Returns available columns for moving the task, excluding the current one. */
  otherColumns() {
    const all: TaskInterface['taskType'][] = ['toDo', 'inProgress', 'feedback', 'done'];
    return all
      .filter((status) => status !== this.taskData.taskType)
      .map((taskStatus) => {
        const title = {
          toDo: 'To do',
          inProgress: 'In progress',
          feedback: 'Await feedback',
          done: 'Done',
        }[taskStatus];
        return { taskStatus, title };
      });
  }

  /** Emits a click event unless the menu is open. */
  onCardClick(event: MouseEvent) {
    if (this.menuOpen) {
      this.menuOpen = false;
      event.stopPropagation();
      return;
    }
    this.taskClicked.emit(this.taskData);
  }

}
