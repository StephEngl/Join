import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  inject
} from '@angular/core';
import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';
import { FormsModule } from '@angular/forms';
import { ContactsService } from '../../../services/contacts.service';
import { SingleTaskDataService } from '../../../services/single-task-data.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [FormsModule, CdkAccordionModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {

  // @Input() taskCategories!: any[];
  // @Input() hoveredContact!: any;
  // @Input() mouseX!: number;
  // @Input() mouseY!: number;

  // @Input() subtaskText!: string;
  // @Output() subtaskTextChange = new EventEmitter<string>();

  // @Input() subtasksContainer!: {
  //   text: string;
  //   isEditing: boolean;
  //   isHovered: boolean;
  //   isChecked: boolean;
  // }[];
  // @Output() subtasksContainerChange = new EventEmitter<any[]>();

  // @Input() priorityButtons!: {
  //   imgInactive: string;
  //   imgActive: string;
  //   colorActive: string;
  //   priority: 'Urgent' | 'Medium' | 'Low';
  //   btnActive: boolean;
  // }[];
  // @Output() priorityButtonsChange = new EventEmitter<any[]>();

  // @Input() assignedTo!: any[];
  // @Output() assignedToChange = new EventEmitter<any[]>();

  // @Input() selectedCategory!: string | undefined;
  // @Output() selectedCategoryChange = new EventEmitter<string | undefined>();

  // // Für Subtask-Edit
  // inputFieldSubT: string = '';
  // @ViewChild('inputFieldSubTask') inputFieldSubTaskRef!: ElementRef;

  // // Events für Methoden
  // @Output() inputChange = new EventEmitter<void>();

  // @Output() priorityChange = new EventEmitter<number>();
  // @Output() assignedContactsChange = new EventEmitter<any>();
  // @Output() removeAssignedContact = new EventEmitter<string>();
  // @Output() categoryChange = new EventEmitter<number>();
  // @Output() addSubtask = new EventEmitter<void>();
  // @Output() clearSubtask = new EventEmitter<void>();
  // @Output() editSubtask = new EventEmitter<any>();
  // @Output() editCheckSubtask = new EventEmitter<any>();
  // @Output() deleteSubtask = new EventEmitter<any>();

  // Priority-Button click
  setPriority(index: number) {
    this.taskData.priorityButtons.forEach((btn, i) => btn.btnActive = i === index ? !btn.btnActive : false);
  }

  // edit mit service not sorted yet
  mouseX: number = 0;
  mouseY: number = 0;
  contactsService = inject(ContactsService);
  taskData = inject(SingleTaskDataService);
  searchedCategoryName: string = '';
  searchedContactName: string = '';
  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;
  @ViewChild('categoryAccordionItem') categoryAccordionItem!: CdkAccordionItem;

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
    console.log(this.taskData.assignedTo);
  }

  isContactAssigned(contactId: any): boolean {
    return this.taskData.assignedTo.some((a) => a.contactId === contactId);
  }

  hoveredContact: any = undefined;

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
    this.taskData.assignedTo = this.taskData.assignedTo.filter((id) => id !== contactId);
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
    //this.closeDropdownLists();
  }

  

}
