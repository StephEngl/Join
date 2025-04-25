import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ContactsService } from '../../services/contacts.service';
import {CdkAccordionModule} from '@angular/cdk/accordion';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CdkAccordionModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  today: string = new Date().toISOString().split('T')[0];
  contactsService = inject(ContactsService);
  isEdited = false;
  isFormValid = false;
  subtaskText = '';
  assignedTo: any[] = [];
  searchedContactName: string = '';
  priorityButtons: {imgSrc: string, priority: string} [] = [
    { imgSrc: './assets/icons/kanban/prio_urgent.svg', priority:'Urgent' },
    { imgSrc: './assets/icons/kanban/prio_middle.svg', priority:'Medium'},
    { imgSrc: './assets/icons/kanban/prio_low.svg', priority:'Low'}
  ];
  @Input() forceMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  get isMobile(): boolean {
    // Wenn forceMobile gesetzt ist, immer mobile Variante anzeigen
    return (
      this.forceMobile ||
      this.breakpointObserver.isMatched('(max-width: 450px)')
    );
  }

  clearForm() {}

  onSubmit() {
    console.log('Läuft');
  }

  onInputChange() {
    // Optional: Validierung oder weitere Logik
  }

  addSubtask() {
    if (this.subtaskText.trim()) {
      // Hier Subtask zur Liste hinzufügen
      this.subtaskText = '';
    }
  }

  clearSubtask() {
    this.subtaskText = '';
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  /* "right" side of add task component: methods & functions, e.g. priority, assigned to, ...*/
  setPriority(p: string) {
    console.log(p);
  }

  toggleAssignedContacts(contactId: any) {
    if (!this.assignedTo.includes(contactId)) {
      this.assignedTo.push(contactId);
    } else {
      this.assignedTo = this.assignedTo.filter(id => id !== contactId);
    }
    console.log(this.assignedTo);
  }

  searchContact(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchedContactName = value;
  }

  filteredContacts() {
    return this.contactsService.contacts.filter(contact => 
      contact.name.toLowerCase().includes(this.searchedContactName.toLowerCase())
    );
  }

}
