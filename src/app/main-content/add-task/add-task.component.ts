import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ContactsService } from '../../services/contacts.service';
import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';
import { TaskInterface } from '../../interfaces/task.interface';
import { TasksService } from '../../services/tasks.service';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskOverviewComponent } from './task-overview/task-overview.component';
import { SingleTaskDataService } from '../../services/single-task-data.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    FormsModule,
    CdkAccordionModule,
    TaskDetailsComponent,
    TaskOverviewComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {

  constructor(private router: Router) { }

  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;
  @ViewChild('categoryAccordionItem') categoryAccordionItem!: CdkAccordionItem;
  @ViewChild('inputFieldSubTask') inputFieldSubTaskRef!: ElementRef;

  inputFieldSubT: string = '';
  contactsService = inject(ContactsService);
  tasksService = inject(TasksService);
  taskDataService = inject(SingleTaskDataService);
  toastService = inject(ToastService);
  closeDropdownList: boolean = false;

  mouseX: number = 0;
  mouseY: number = 0;
  hoveredContact: any = undefined;

  isEdited = false;
  isFormValid = false;
  
  searchedContactName: string = '';
  searchedCategoryName: string = '';

  // add-task status
  @Input() isEditTaskDialog: boolean = false;

  //ngOnInit () { taskData = taskDataService }

  @Input() taskData!: TaskInterface;
  @Output() cancelEditTask = new EventEmitter<void>(); // Added: to notify parent component when editing is canceled
  @Output() taskUpdated = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<boolean>();

  ngOnInit() {
    if(!this.taskDataService.editModeActive) {
      this.clearForm();
    }
    console.log(this.isEditTaskDialog);
    
  }

  @HostListener('click')
  closeDropDowns() {
    this.closeDropdownList = true;
    setTimeout(() => {
      this.closeDropdownList = false;
    }, 1);
  }

  onSubmit() {
    const isEditMode = this.taskDataService.editModeActive;
    const task = this.getAllTaskData();
    if (isEditMode) {
      this.submitEdit(task);
    } else {
      this.submitCreate(task);
      this.closeIfDialog();
    }
  }

  get formInvalid() {
    return this.isFormInvalid();
  }

  isFormInvalid(): boolean {
    return !this.taskDataService.selectedCategory || this.taskDataService.inputTaskTitle.length < 3;
  }

  getAllTaskData() {
    const isEditMode = this.taskDataService.editModeActive;
    const baseTaskData = this.currentTaskData();
    const editTaskData = isEditMode ? {
          id: this.taskData.id,
          taskType: this.taskData.taskType,
        } : {};
    const task = { ...baseTaskData, ...editTaskData };
    return task;
  }

  submitEdit(task: TaskInterface) {
    this.tasksService.updateTask(task);
    this.toastService.triggerToast(
      'Task updated',
      'update',
    );
    this.cancelEditTask.emit();
  }

  submitCreate(task: TaskInterface) {
    this.tasksService.addTask(task);
    this.toastService.triggerToast(
      'Task added to board',
      'create',
      'assets/icons/navbar/board.svg'
    );
    this.taskCreated.emit();
    setTimeout(() => {
      this.router.navigate(['/board']);
      this.clearForm();
    }, 1000);
  }
  
  clearForm() {
    this.taskDataService.clearData();
  }

  currentTaskData(): Omit<TaskInterface, 'id'> {
    const subtasksForForm = this.taskDataService.subtasksContainer.map((subtask) => ({
      text: subtask.text,
      isChecked: subtask.isChecked,
    }));

    const activeBtn = this.taskDataService.priorityButtons.find(
      (btnStatus) => btnStatus.btnActive
    );

    const submittedTask: TaskInterface = {
      title: this.taskDataService.inputTaskTitle,
      description: this.taskDataService.inputTaskDescription,
      dueDate: this.taskDataService.inputTaskDueDate,
      assignedTo: this.taskDataService.assignedTo,
      subTasks: subtasksForForm,
      priority: (activeBtn?.priority.toLowerCase() || 'medium') as 'urgent' | 'medium' | 'low',
      category: this.taskDataService.selectedCategory,
      taskType: this.taskDataService.taskStatus,
    };
    return submittedTask;
  }

  addSubtask() {
    const subtask = {
      text: this.taskDataService.subtaskText,
      isEditing: false,
      isHovered: false,
      isChecked: false,
    };
    if (this.taskDataService.subtaskText.trim()) {
      this.taskDataService.subtasksContainer.push(subtask);
      this.taskDataService.subtaskText = '';
    }
  }

  clearSubtask() {
    this.taskDataService.subtaskText = '';
  }

  editSubtask(subtask: any) {
    subtask.isEditing = true;
    this.inputFieldSubT = subtask.text;
    setTimeout(() => {
      this.inputFieldSubTaskRef.nativeElement.focus();
    }, 0);
  }

  editCheckSubtask(subtask: any) {
    const index = this.taskDataService.subtasksContainer.indexOf(subtask);
    this.taskDataService.subtasksContainer[index].text = this.inputFieldSubT;
    subtask.isEditing = false;
  }

  deleteSubtask(subtask: any) {
    const index = this.taskDataService.subtasksContainer.indexOf(subtask);
    if (index !== -1) {
      this.taskDataService.subtasksContainer.splice(index, 1);
    }
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  setPriority(index: number, prioOutput: string) {
    this.resetOtherBtnStatuses(index);
    this.taskDataService.priorityButtons[index].btnActive =
      !this.taskDataService.priorityButtons[index].btnActive;
  }

  resetOtherBtnStatuses(index: number) {
    this.taskDataService.priorityButtons.forEach((btn) => {
      if (this.taskDataService.priorityButtons.indexOf(btn) === index) return;
      btn.btnActive = false;
    });
  }

  toggleAssignedContacts(contactId: any) {
    const exists = this.taskDataService.assignedTo.some((contact) => contact.contactId === contactId);
    if (!exists) {
      this.taskDataService.assignedTo.push({ contactId });
    } else {
      this.taskDataService.assignedTo = this.taskDataService.assignedTo.filter((contact) => contact.contactId !== contactId);
    }
  }

  contactSelected() {
    this.taskDataService.assignedTo.forEach((contact) => {
      const exists = this.contactsService.contacts.some((c) => c.id === contact.contactId);
    });
  }

  isContactAssigned(contactId: any): boolean {
    return this.taskDataService.assignedTo.some((a) => a.contactId === contactId);
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
    return this.contactsService.contacts.filter((contact) =>
      contact.name
        .toLowerCase()
        .includes(this.searchedContactName.toLowerCase())
    );
  }

  filteredCategories() {
    return this.taskDataService.taskCategories.filter((category) =>
      category.toLowerCase().includes(this.searchedCategoryName.toLowerCase())
    );
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
    this.taskDataService.assignedTo = this.taskDataService.assignedTo.filter((id) => id !== contactId);
    this.hoveredContact = undefined;
  }

  setCategory(index: number) {
    this.taskDataService.selectedCategory = this.filteredCategories()[index];
  }

  closeIfDialog() {
    this.closeDialog.emit(true);
  }
}
