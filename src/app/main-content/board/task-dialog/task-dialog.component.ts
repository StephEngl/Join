import { Component } from '@angular/core';
import { AddTaskComponent } from '../../add-task/add-task.component';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [AddTaskComponent],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent {
}
