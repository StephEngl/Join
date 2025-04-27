import { Component, Input, inject, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ContactsService } from '../../services/contacts.service';
import {CdkAccordionItem, CdkAccordionModule} from '@angular/cdk/accordion';
import { TaskInterface } from '../../interfaces/task.interface';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CdkAccordionModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  @ViewChild('accordionItem')accordionItem!: CdkAccordionItem;
  @ViewChild('categoryAccordionItem')categoryAccordionItem!: CdkAccordionItem;
  @ViewChild('inputFieldSubTask') inputFieldSubTaskRef!: ElementRef;
  inputField: string = "";
  today: string = new Date().toISOString().split('T')[0];
  contactsService = inject(ContactsService);
  mouseX: number = 0;
  mouseY: number = 0;
  isEdited = false;
  isFormValid = false;
  subtaskText = '';
  subtasksContainer: {text: string, isEditing: boolean, isHovered: boolean}[] = [];
  assignedTo: any[] = [];
  searchedContactName: string = '';
  searchedCategoryName: string = '';
  taskCategories: string[] = [
    'Technical Task', 'User Story'
  ];
  selectedCategory: string = '';
  priorityButtons: {
    imgInactive: string,
    imgActive: string,
    colorActive: string;
    priority: string,
    btnActive: boolean } [] = [
    { 
      imgInactive: './assets/icons/kanban/prio_urgent.svg',
      imgActive:"./assets/icons/kanban/prio_urgent_white.svg",
      colorActive: "#FF3D00",
      priority:'Urgent',
      btnActive: false
    },
    { 
      imgInactive: './assets/icons/kanban/prio_medium.svg',
      imgActive:"./assets/icons/kanban/prio_medium_white.svg",
      colorActive: "#FFA800",
      priority:'Medium',
      btnActive: false
    },
    {
      imgInactive: './assets/icons/kanban/prio_low.svg',
      imgActive:"./assets/icons/kanban/prio_low_white.svg",
      colorActive: "#7AE229",
      priority:'Low',
      btnActive: false
    }
  ];
  @Input() forceMobile = false;
  @Input() taskData!: TaskInterface;

  constructor(private breakpointObserver: BreakpointObserver) {}

  get isMobile(): boolean {
    // Wenn forceMobile gesetzt ist, immer mobile Variante anzeigen
    return (
      this.forceMobile ||
      this.breakpointObserver.isMatched('(max-width: 450px)')
    );
  }

  @HostListener('document:click')
  closeDropdownLists(): void {
    this.accordionItem.close();
    this.categoryAccordionItem.close()
  }

  clearForm() {}

  onSubmit() {
    console.log('Läuft');
  }

  onInputChange() {
    // Optional: Validierung oder weitere Logik
  }

  addSubtask() {
    const subtask = {text : this.subtaskText, isEditing : false, isHovered : false}
    if (this.subtaskText.trim()) {
      this.subtasksContainer.push(subtask)
      this.subtaskText = '';
    }
  }

  clearSubtask() {
    this.subtaskText = '';
  }

  editSubtask(subtask: any) {
    subtask.isEditing = true;
    this.inputField = subtask.text;
    setTimeout(() => {
      this.inputFieldSubTaskRef.nativeElement.focus();
    }, 0); 
  }
  

  editCheckSubtask(subtask: any) {
    const index = this.subtasksContainer.indexOf(subtask);
    this.subtasksContainer[index].text = this.inputField;
    subtask.isEditing = false;
  }

  deleteSubtask(subtask: any) {
    const index = this.subtasksContainer.indexOf(subtask);
    if (index !== -1) {
      this.subtasksContainer.splice(index, 1);
    }
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  /* "right" side of add task component: methods & functions, e.g. priority, assigned to, ...*/
  setPriority(index: number, prioOutput: string) {
    this.resetOtherBtnStatuses(index);
    this.priorityButtons[index].btnActive = !this.priorityButtons[index].btnActive;
  }

  resetOtherBtnStatuses(index: number) {
    this.priorityButtons.forEach((btn) => {
      if (this.priorityButtons.indexOf(btn) === index) return;
      btn.btnActive = false;
    });
  }

  toggleAssignedContacts(contactId: any) {
    if (!this.assignedTo.includes(contactId)) {
      this.assignedTo.push(contactId);
    } else {
      this.assignedTo = this.assignedTo.filter(id => id !== contactId);
    }
    console.log(this.assignedTo);
  }

  contactSelected() {
    this.assignedTo.forEach((contact)=> {
      const exists = this.contactsService.contacts.some(c => c.id === contact);
    })
  }

  searchContact(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchedContactName = value;
  }

  searchCategory(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchedCategoryName = value;
  }

  filteredContacts() {
    return this.contactsService.contacts.filter(contact => 
      contact.name.toLowerCase().includes(this.searchedContactName.toLowerCase())
    );
  }

  filteredCategories() {
    return this.taskCategories.filter(category => 
      category.toLowerCase().includes(this.searchedCategoryName.toLowerCase())
    );
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
    this.assignedTo = this.assignedTo.filter(id => id !== contactId);
    this.hoveredContact = undefined;
  }

  setCategory(index: number) {
    this.selectedCategory = this.filteredCategories()[index];
    this.closeDropdownLists();
  }

}
