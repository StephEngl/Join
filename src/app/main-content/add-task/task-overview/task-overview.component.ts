import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { SingleTaskDataService } from '../../../services/single-task-data.service';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TasksService } from '../../../services/tasks.service';

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
    tasksService = inject(TasksService)
    @Input() taskData!: TaskInterface;
    @Input() currentTaskId: string = '';
    @Input() today: string = new Date().toISOString().split('T')[0];

    ngOnInit() {
      this.setFormData();
    }

    taskIndex():number {
      if(this.taskData && this.taskData.id) {
          const index = this.tasksService.findIndexById(this.taskData.id);
          if (index !== -1) {
              return index;
          }
      }
      return -1;
    }

    setFormData() {
      if(this.taskDataService.editModeActive) {
        this.taskDataService.inputTaskTitle = this.taskData.title;
        this.taskDataService.inputTaskDescription = this.taskData.description;
        this.taskDataService.inputTaskDueDate = this.taskData.dueDate;
      }
    }

    onDueDateChange(value: string) {
      this.tasksService.tasks[this.taskIndex()].dueDate = new Date(value);
    }

    formatDate(date: Date | null): string | null {
      return date ? date.toISOString().split('T')[0] : null;
    }
}
