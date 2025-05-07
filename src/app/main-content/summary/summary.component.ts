import { Component } from '@angular/core';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {


  taskColumns: string[] = ['Tasks in<br>Board', 'Tasks In<br>Progress', 'Awaiting<br>Feedback'];
}
