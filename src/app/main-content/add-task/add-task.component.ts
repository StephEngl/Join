import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../../interfaces/task.interface';
import { TasksService } from '../../services/tasks.service';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskOverviewComponent } from './task-overview/task-overview.component';
import { SingleTaskDataService } from '../../services/single-task-data.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TaskDetailsComponent,
    TaskOverviewComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  constructor(private router: Router) {}

  tasksService = inject(TasksService);
  taskDataService = inject(SingleTaskDataService);
  toastService = inject(ToastService);
  signalService = inject(SignalsService);

  // add-task status
  @Input() isEditTaskDialog: boolean = false;
  @Input() isAddTaskDialog: boolean = false;
  @Input() taskData!: TaskInterface;

  @Output() cancelEditTask = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  /**
   * Initializes the component and clears the form if not in edit mode.
   */
  ngOnInit() {
    if (!this.taskDataService.editModeActive) {
      this.clearForm();
    }
  }

  /**
   * Handles form submission for creating or editing a task.
   */
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

  /**
   * Returns whether the form is invalid.
   */
  get formInvalid() {
    return this.isFormInvalid();
  }

  /**
   * Checks if the form is invalid based on required fields.
   * @returns True if the form is invalid, otherwise false.
   */
  isFormInvalid(): boolean {
    return (
      !this.taskDataService.selectedCategory ||
      this.taskDataService.inputTaskTitle.length < 3
    );
  }

  /**
   * Gathers all task data from the form and state.
   * @returns A complete TaskInterface object for submission.
   */
  getAllTaskData() {
    const isEditMode = this.taskDataService.editModeActive;
    const baseTaskData = this.currentTaskData();
    const editTaskData = isEditMode
      ? {
          id: this.taskData.id,
          taskType: this.taskData.taskType,
        }
      : {};
    const task = { ...baseTaskData, ...editTaskData };
    return task;
  }

  /**
   * Submits the edited task, updates the task, and shows a toast.
   * @param task The edited task object.
   */
  submitEdit(task: TaskInterface) {
    this.tasksService.updateTask(task);
    this.toastService.triggerToast('Task updated', 'update');
    this.cancelEditTask.emit();
  }

  /**
   * Submits a new task, adds it, shows a toast, and navigates to the board.
   * @param task The new task object.
   */
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

  /**
   * Clears all form fields and resets task data.
   */
  clearForm() {
    this.taskDataService.clearData();
  }

  /**
   * Sets signals to indicate that the form fields have been reset.
   */
  setFormResetSignals() {
    this.signalService.titleCleared.set(true);
    this.signalService.dateCleared.set(true);
  }

  /**
   * Returns the current task data excluding the task ID.
   * @returns Task data object without ID.
   */
  currentTaskData(): Omit<TaskInterface, 'id'> {
    const subtasksForForm = this.getSubtasksForForm();
    const submittedTask: TaskInterface = {
      title: this.taskDataService.inputTaskTitle,
      description: this.taskDataService.inputTaskDescription,
      dueDate: this.taskDataService.inputTaskDueDate,
      assignedTo: this.taskDataService.assignedTo,
      subTasks: subtasksForForm,
      priority: this.getSelectedPriority(),
      category: this.taskDataService.selectedCategory,
      taskType: this.taskDataService.taskStatus,
    };
    return submittedTask;
  }

  /**
   * Maps subtasks to the required form structure.
   * @returns Array of subtasks for the form.
   */
  private getSubtasksForForm(): { text: string; isChecked: boolean }[] {
    return this.taskDataService.subtasksContainer.map((subtask) => ({
      text: subtask.text,
      isChecked: subtask.isChecked,
    }));
  }

  /**
   * Returns the selected priority as a string ('urgent' | 'medium' | 'low').
   * Defaults to 'medium' if none is selected.
   * @returns The selected priority.
   */
  private getSelectedPriority(): 'urgent' | 'medium' | 'low' {
    const activeBtn = this.taskDataService.priorityButtons.find(
      (btn) => btn.btnActive
    );
    return (activeBtn?.priority.toLowerCase() || 'medium') as
      | 'urgent'
      | 'medium'
      | 'low';
  }

  /**
   * Emits the close event if the component is used as a dialog.
   */
  closeIfDialog() {
    this.close.emit();
  }
}
