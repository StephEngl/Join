import { Component, Input, ViewChild, ElementRef, inject, HostListener } from '@angular/core';
import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';
import { FormsModule } from '@angular/forms';
import { ContactsService } from '../../../services/contacts.service';
import { SingleTaskDataService } from '../../../services/single-task-data.service';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  host: { 'class': 'task-details' },
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

  ngOnInit() {
    this.setPriorityInEditMode();
    this.setAssignedContactsInEditMode();
    this.setCategoryInEditMode();
    this.setSubtasksInEditMode();
  }

  ngOnChanges() {
    if (this.closeDropdownList) {
      this.closeDropdownLists();
    }
  }

  @HostListener('document:click')
  closeDropdownLists(): void {
    this.accordionItem.close();
    this.categoryAccordionItem.close();
  }
  
  taskIndex():number {
    if(this.taskDataInput && this.taskDataInput.id) {
        const index = this.tasksService.findIndexById(this.taskDataInput.id);
        if (index !== -1) {
            return index;
        }
    }
    return -1;
  }

  searchContact(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchedContactName = value;
  }

  filteredContacts() {
    return this.contactsService.contacts.filter((contact) =>
      contact.name
        .toLowerCase()
        .includes(this.searchedContactName.toLowerCase())
    );
  }

  setPriorityInEditMode(): void {
    if (!this.taskData.editModeActive) {
      this.taskData.priorityButtons.forEach(btn => btn.btnActive = false);
    } else {
      const index = this.taskData.priorityButtons.findIndex(
        btn => btn.priority.toLowerCase() === this.tasksService.tasks[this.taskIndex()].priority.toLowerCase()
      );
      if (index !== -1) {
        this.setPriority(index);
      }
    }
  }

  setAssignedContactsInEditMode(): void {
    if (!this.taskData.editModeActive) {
      this.taskData.assignedTo = []
      return;
    } 
    this.taskData.assignedTo = this.tasksService.tasks[this.taskIndex()].assignedTo?.map(contact => ({
      contactId: contact.contactId,
    })) || [];
  }

  setPriority(index: number) {
    this.taskData.priorityButtons.forEach((btn, i) => btn.btnActive = i === index);
  }

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

  isContactAssigned(contactId: any): boolean {
    return this.taskData.assignedTo.some((a) => a.contactId === contactId);
  }

  startContactHover(contact: any) {
    this.hoveredContact = contact;
  }

  moveContactHover(event: MouseEvent) {
    this.mouseX = event.clientX + 10;
    this.mouseY = event.clientY + 10;
  }

  endContactHover() {
    this.hoveredContact = undefined;
  }

  removeAssignedContact(contactId: string): void {
    this.taskData.assignedTo = this.taskData.assignedTo.filter(
      (c) => c.contactId !== contactId
    );
    this.hoveredContact = undefined;
  }

  searchCategory(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchedCategoryName = value;
  }

  filteredCategories() {
    return this.taskData.taskCategories.filter((category) =>
      category.toLowerCase().includes(this.searchedCategoryName.toLowerCase())
    );
  }

  setCategory(index: number) {
    this.taskData.selectedCategory = this.filteredCategories()[index];
  }

  setCategoryInEditMode(): void {
    if (!this.taskData.editModeActive) {
      this.taskData.selectedCategory = undefined;
      return;
    }
    this.taskData.selectedCategory = this.tasksService.tasks[this.taskIndex()].category || undefined;
  }

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

  clearSubtask() {
    this.subtaskText = '';
  }

  editSubtask(subtask: any) {
    subtask.isEditing = true;
    this.inputFieldSubT = subtask.text;
    setTimeout(() => {
      this.inputFieldSubTaskRef.nativeElement.focus();
    }, 0);
  }

  setSubtasksInEditMode(): void {
    if (!this.taskData.editModeActive) {
      this.taskData.subtasksContainer = [];
      return;
    }
    this.taskData.subtasksContainer = this.tasksService.tasks[this.taskIndex()].subTasks?.map(subtask => ({
      text: subtask.text,
      isEditing: false,
      isHovered: false,
      isChecked: subtask.isChecked ?? false
    })) || [];
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  deleteSubtask(subtask: any) {
    const index = this.taskData.subtasksContainer.indexOf(subtask);
    if (index !== -1) {
      this.taskData.subtasksContainer.splice(index, 1);
    }
  }

  editCheckSubtask(subtask: any) {
    const index = this.taskData.subtasksContainer.indexOf(subtask);
    this.taskData.subtasksContainer[index].text = this.inputFieldSubT;
    subtask.isEditing = false;
  }

}
