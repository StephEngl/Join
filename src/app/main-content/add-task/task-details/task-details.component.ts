import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  inject,
  HostListener,
} from '@angular/core';
import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';
import { FormsModule } from '@angular/forms';
import { ContactsService } from '../../../services/contacts.service';
import { SingleTaskDataService } from '../../../services/single-task-data.service';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TasksService } from '../../../services/tasks.service';

/**
 * Displays detailed information about a single task, including:
 * - Editing priority, category, subtasks, and assigned contacts
 * - Filtering/search functionality for contacts and categories
 * - Interactive accordion UI with subtask management
 */
@Component({
  selector: 'app-task-details',
  standalone: true,
  host: { class: 'task-details' },
  imports: [FormsModule, CdkAccordionModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  @Input() taskDataInput!: TaskInterface;
  @Input() closeDropdownList: boolean = false;
  mouseX: number = 0;
  mouseY: number = 0;
  contactsService = inject(ContactsService);
  taskData = inject(SingleTaskDataService);
  tasksService = inject(TasksService);
  searchedCategoryName: string = '';
  searchedContactName: string = '';
  subtaskText: string = '';
  inputFieldSubT: string = '';
  hoveredContact: any = undefined;
  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;
  @ViewChild('categoryAccordionItem') categoryAccordionItem!: CdkAccordionItem;
  @ViewChild('inputFieldSubTask') inputFieldSubTaskRef!: ElementRef;

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Initializes the component by setting either default values (non-edit mode)
   * or populating fields with existing task data (edit mode).
   */
  ngOnInit() {
    if (!this.taskData.editModeActive) {
      this.taskData.priorityButtons[1].btnActive = true;
    } else {
      this.setEditModeValues();
    }
  }

  /** Closes dropdowns when the corresponding input is triggered. */
  ngOnChanges() {
    if (this.closeDropdownList) {
      this.closeDropdownLists();
    }
  }

  /**
   * Sets values for priority, assigned contacts, category, and subtasks
   * based on existing task data when in edit mode.
   */
  setEditModeValues() {
    this.setPriorityInEditMode();
    this.setAssignedContactsInEditMode();
    this.setCategoryInEditMode();
    this.setSubtasksInEditMode();
  }

  /** Closes all dropdown accordions (e.g., on document click). */
  @HostListener('document:click')
  closeDropdownLists(): void {
    this.accordionItem.close();
    this.categoryAccordionItem.close();
  }

  /** Returns the index of the current task in the task list. */
  taskIndex(): number {
    if (this.taskDataInput && this.taskDataInput.id) {
      const index = this.tasksService.findIndexById(this.taskDataInput.id);
      if (index !== -1) {
        return index;
      }
    }
    return -1;
  }

  /** Updates contact input search value. */
  searchContact(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchedContactName = value;
  }

  /** Filters the contact list by name. */
  filteredContacts() {
    return this.contactsService.contacts.filter((contact) =>
      contact.name
        .toLowerCase()
        .includes(this.searchedContactName.toLowerCase())
    );
  }

  /** Sets the task's priority during edit mode. */
  setPriorityInEditMode(): void {
    if (!this.taskData.editModeActive) {
      this.taskData.priorityButtons.forEach((btn) => (btn.btnActive = false));
    } else {
      const index = this.taskData.priorityButtons.findIndex(
        (btn) =>
          btn.priority.toLowerCase() ===
          this.tasksService.tasks[this.taskIndex()].priority.toLowerCase()
      );
      if (index !== -1) {
        this.setPriority(index);
      }
    }
  }

  /** Populates assigned contacts when editing a task.*/
  setAssignedContactsInEditMode(): void {
    if (!this.taskData.editModeActive) {
      this.taskData.assignedTo = [];
      return;
    }
    this.taskData.assignedTo =
      this.tasksService.tasks[this.taskIndex()].assignedTo?.map((contact) => ({
        contactId: contact.contactId,
      })) || [];
  }

  /** Activates the priority button at the given index. */
  setPriority(index: number) {
    this.taskData.priorityButtons.forEach(
      (btn, i) => (btn.btnActive = i === index)
    );
  }

  /**
   * Toggles assignment of a contact to the task.
   * @param contactId The unique identifier of the contact to assign or unassign.
   */
  toggleAssignedContacts(contactId: any) {
    const exists = this.taskData.assignedTo.some(
      (contact) => contact.contactId === contactId
    );
    if (!exists) {
      this.taskData.assignedTo.push({ contactId });
    } else {
      this.taskData.assignedTo = this.taskData.assignedTo.filter(
        (contact) => contact.contactId !== contactId
      );
    }
  }

  /** Checks if a contact is currently assigned to the task. */
  isContactAssigned(contactId: any): boolean {
    return this.taskData.assignedTo.some((a) => a.contactId === contactId);
  }

  /** Starts contact hover effect */
  startContactHover(contact: any) {
    this.hoveredContact = contact;
  }

  /** Updates tooltip position during hover */
  moveContactHover(event: MouseEvent) {
    this.mouseX = event.clientX + 10;
    this.mouseY = event.clientY + 10;
  }

  /** Ends contact hover effect */
  endContactHover() {
    this.hoveredContact = undefined;
  }

  /** Removes a contact from assigned list */
  removeAssignedContact(contactId: string): void {
    this.taskData.assignedTo = this.taskData.assignedTo.filter(
      (c) => c.contactId !== contactId
    );
    this.hoveredContact = undefined;
  }

  /** Updates category search value */
  searchCategory(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchedCategoryName = value;
  }

  /** Filters category list by search input */
  filteredCategories() {
    return this.taskData.taskCategories.filter((category) =>
      category.toLowerCase().includes(this.searchedCategoryName.toLowerCase())
    );
  }

  /** Sets selected category by index */
  setCategory(index: number) {
    this.taskData.selectedCategory = this.filteredCategories()[index];
  }

  /** Populates selected category during edit mode */
  setCategoryInEditMode(): void {
    if (!this.taskData.editModeActive) {
      this.taskData.selectedCategory = undefined;
      return;
    }
    this.taskData.selectedCategory =
      this.tasksService.tasks[this.taskIndex()].category || undefined;
  }

  /** Adds a new subtask */
  addSubtask() {
    const subtask = {
      text: this.subtaskText,
      isEditing: false,
      isHovered: false,
      isChecked: false,
    };
    if (this.subtaskText.trim()) {
      this.taskData.subtasksContainer.push(subtask);
      this.subtaskText = '';
    }
  }

  /** Clears the subtask input */
  clearSubtask() {
    this.subtaskText = '';
  }

  /** Enables edit mode for a given subtask */
  editSubtask(subtask: any) {
    subtask.isEditing = true;
    this.inputFieldSubT = subtask.text;
    setTimeout(() => {
      this.inputFieldSubTaskRef.nativeElement.focus();
    }, 0);
  }

  /** Populates subtasks during edit mode */
  setSubtasksInEditMode(): void {
    if (!this.taskData.editModeActive) {
      this.taskData.subtasksContainer = [];
      return;
    }
    this.taskData.subtasksContainer =
      this.tasksService.tasks[this.taskIndex()].subTasks?.map((subtask) => ({
        text: subtask.text,
        isEditing: false,
        isHovered: false,
        isChecked: subtask.isChecked ?? false,
      })) || [];
  }

  /** Focuses the given input element */
  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  /** Deletes a subtask */
  deleteSubtask(subtask: any) {
    const index = this.taskData.subtasksContainer.indexOf(subtask);
    if (index !== -1) {
      this.taskData.subtasksContainer.splice(index, 1);
    }
  }

  /** Saves edits made to a subtask's text
   *  Empty subtasks can't be saved
   */
  editCheckSubtask(subtask: any) {
    const trimmedSubtaskInput = this.inputFieldSubT.trim();
    if (trimmedSubtaskInput.length === 0) {
      subtask.isEditing = false;
      return;
    }
    const index = this.taskData.subtasksContainer.indexOf(subtask);
    this.taskData.subtasksContainer[index].text = this.inputFieldSubT;
    subtask.isEditing = false;
  }
}
