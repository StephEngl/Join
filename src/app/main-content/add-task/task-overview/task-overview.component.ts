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
    taskDataService = inject(SingleTaskDataService);
    @Input() taskData!: TaskInterface;
    @Input() currentTaskId: string = '';
    @Input() today: string = new Date().toISOString().split('T')[0];

    ngOnInit() {
      this.setFormData();
    }

    setFormData() {
      if(this.taskDataService.editModeActive) {
        this.taskDataService.inputTaskTitle = this.taskData.title;
        this.taskDataService.inputTaskDescription = this.taskData.description;
        this.taskDataService.inputTaskDueDate = this.taskData.dueDate;
      }
    }

    onDueDateChange(value: string) {
      this.taskDataService.inputTaskDueDate = new Date(value);
    }

    formatDate(date: Date | null): string | null {
      return date ? date.toISOString().split('T')[0] : null;
    }
}
