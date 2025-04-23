import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  today: string = new Date().toISOString().split('T')[0];
  isEdited = false;
  isFormValid = false;
  subtaskText = '';

  clearForm() {}

  onSubmit() {
    console.log("Läuft");
    
  }

  onInputChange() {
    // Optional: Validierung oder weitere Logik
  }

  addSubtask() {
    if (this.subtaskText.trim()) {
      // Hier Subtask zur Liste hinzufügen
      this.subtaskText = '';
    }
  }

  clearSubtask() {
    this.subtaskText = '';
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }
}
