import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [FormsModule, CdkAccordionModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  @Input() contactsService!: any;
  @Input() taskCategories!: any[];
  @Input() hoveredContact!: any;
  @Input() mouseX!: number;
  @Input() mouseY!: number;

  @Input() subtaskText!: string;
  @Output() subtaskTextChange = new EventEmitter<string>();

  @Input() subtasksContainer!: {
    text: string;
    isEditing: boolean;
    isHovered: boolean;
    isChecked: boolean;
  }[];
  @Output() subtasksContainerChange = new EventEmitter<any[]>();

  @Input() priorityButtons!: {
    imgInactive: string;
    imgActive: string;
    colorActive: string;
    priority: 'Urgent' | 'Medium' | 'Low';
    btnActive: boolean;
  }[];
  @Output() priorityButtonsChange = new EventEmitter<any[]>();

  @Input() assignedTo!: any[];
  @Output() assignedToChange = new EventEmitter<any[]>();

  @Input() selectedCategory!: string | undefined;
  @Output() selectedCategoryChange = new EventEmitter<string | undefined>();

  // Für Subtask-Edit
  inputFieldSubT: string = '';
  @ViewChild('inputFieldSubTask') inputFieldSubTaskRef!: ElementRef;

  // Events für Methoden
  @Output() inputChange = new EventEmitter<void>();

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
    this.priorityButtons.forEach((btn, i) => btn.btnActive = i === index ? !btn.btnActive : false);
    this.priorityButtonsChange.emit(this.priorityButtons);
  }

  // edit mit service not sorted yet
  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;
  @ViewChild('categoryAccordionItem') categoryAccordionItem!: CdkAccordionItem;

  searchedContactName: string = '';

  searchContact(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchedContactName = value;
  }

  // filteredContacts() {
  //   return this.contactsService.contacts.filter((contact) =>
  //     contact.name
  //       .toLowerCase()
  //       .includes(this.searchedContactName.toLowerCase())
  //   );
  // }



}
