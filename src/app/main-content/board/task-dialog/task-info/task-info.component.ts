import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog.component';

@Component({
  selector: 'app-task-info',
  standalone: true,
  imports: [TaskDialogComponent],
  templateUrl: './task-info.component.html',
  styleUrl: './task-info.component.scss'
})
export class TaskInfoComponent {
  constructor(private dialog: MatDialog) {}

  openTaskDialog() {
    this.dialog.open(TaskDialogComponent);
  }
}
