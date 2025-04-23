import { Component } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  totalSubtasks = 2;
  doneSubtasks = 1;

  get progressPercentage(): number {
    return (this.doneSubtasks / this.totalSubtasks) * 100;
  }
}
