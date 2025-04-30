import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { SingleTaskDataService } from '../../../services/single-task-data.service';
import { TaskInterface } from '../../../interfaces/task.interface';

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  host: { 'class': 'task-overview' },
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss',
})
export class TaskOverviewComponent {
  @Input() taskData!: TaskInterface;
  taskDataService = inject(SingleTaskDataService);
  @Input() currentTaskId: string = '';

  @Input() taskTitle: string = '';
  @Output() taskTitleChange = new EventEmitter<string>();

  @Input() taskDescription: string = '';
  @Output() taskDescriptionChange = new EventEmitter<string>();

  @Input() today: string = new Date().toISOString().split('T')[0];
  @Input() taskDueDate: Date | null = null;
  @Output() taskDueDateChange = new EventEmitter<Date | null>();
  @Input() minDate: Date = new Date();

  onDueDateChange(date: Date | null) {
    this.taskDueDateChange.emit(date);
  }

  validateForm(): boolean {
    return !!this.taskTitle && !!this.taskDueDate;
  }
}
