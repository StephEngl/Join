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
@Input() today: string = new Date().toISOString().split('T')[0];

// Zweiwegebindung ([(...)]): Input + Output
@Input() taskTitle: string = '';
@Output() taskTitleChange = new EventEmitter<string>();

@Input() taskDescription: string = '';
@Output() taskDescriptionChange = new EventEmitter<string>();

@Input() taskDueDate: Date | null = null;
@Output() taskDueDateChange = new EventEmitter<Date | null>();

taskDataService = inject(SingleTaskDataService);

ngOnInit() {
  if (this.taskDataService.editModeActive && this.taskData) {
    this.taskTitleChange.emit(this.taskData.title);
    this.taskDescriptionChange.emit(this.taskData.description);
    console.log(this.taskDueDate);
    
  }
}

formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

  // DO NOT DELETE, THIS IS USED
  // onDueDateChange(dateString: string | null) {
  //   const date = dateString ? new Date(dateString) : null;
  //   this.taskDueDateChange.emit(date);
  // }

  // formatDate(date: Date | null): string | null {
  //   return date ? date.toISOString().split('T')[0] : null;
  // }
}
