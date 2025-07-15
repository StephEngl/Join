import { CommonModule } from '@angular/common';
import { Component, Input, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SingleTaskDataService } from '../../../services/single-task-data.service';
import { TaskInterface } from '../../../interfaces/task.interface';
import { TasksService } from '../../../services/tasks.service';
import { SignalsService } from '../../../services/signals.service';
import { ToastService } from '../../../services/toast.service';
import { CdkAccordionItem, CdkAccordionModule } from '@angular/cdk/accordion';
import { TaskImageData } from '../../../interfaces/task-image-data';

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [FormsModule, CommonModule, CdkAccordionModule],
  host: { class: 'task-overview' },
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss',
})

/**
 * Displays a task overview with optional edit functionality.
 * Allows editing title, description, and due date if edit mode is active.
 */
export class TaskOverviewComponent {
  taskDataService = inject(SingleTaskDataService);
  tasksService = inject(TasksService);
  signalService = inject(SignalsService);
  toastService = inject(ToastService);
  taskImages: TaskImageData[] = [];

  @Input() taskData!: TaskInterface;
  @Input() today: string = new Date().toISOString().split('T')[0];

  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;

  ngOnInit() {
    this.setFormData();
    // this.imageService.subscribeToImages;
  }

  /** Returns the index of the current task or -1 if not found. */
  taskIndex(): number {
    if (this.taskData && this.taskData.id) {
      const index = this.tasksService.findIndexById(this.taskData.id);
      if (index !== -1) {
        return index;
      }
    }
    return -1;
  }

  /** Sets form fields from task data if in edit mode. */
  setFormData() {
    if (this.taskDataService.editModeActive) {
      this.taskDataService.inputTaskTitle = this.taskData.title;
      this.taskDataService.inputTaskDescription = this.taskData.description;
      this.taskDataService.inputTaskDueDate = this.taskData.dueDate;
    }
  }

  /** Updates task's due date directly. */
  onDueDateEditChange(value: string) {
    this.tasksService.tasks[this.taskIndex()].dueDate = new Date(value);
  }

  /** Updates due date in the input form. */
  onDueDateChange(value: string) {
    this.taskDataService.inputTaskDueDate = new Date(value);
  }

  /** Formats a Date to YYYY-MM-DD or returns null. */
  formatDate(date: Date | null): string | null {
    return date ? date.toISOString().split('T')[0] : null;
  }

  // Images and Gallery Viewer methods

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    for (const file of Array.from(input.files)) {
      if (!file.type.startsWith('image/')) {
        this.toastService.triggerToast('Incorrect file-type. Please load image', 'error');
        return;
      }
      try {
        const compressedBase64 = await this.convertBlobToCompressedBase64(
          file, 800, 800, 0.8);
       this.taskImages.push({
        filename: file.name,
        fileType: file.type,
        size: file.size,
        base64: compressedBase64,
      });
      } catch (error) {
        console.error('Fehler beim Hinzufügen:', error);

        this.toastService.triggerToast(
          `Error while processing ${file.name}: ${(error as Error).message}`,
        "error"
        );
      }
    }
  }

  /**
   * Komprimiert ein Bild (Blob) auf eine Zielgröße oder -qualität
   * @param {Blob} blob - Das Bild, das komprimiert werden soll
   * @param {number} maxWidth - Die maximale Breite des Bildes
   * @param {number} maxHeight - Die maximale Höhe des Bildes
   * @param {number} quality - Qualität des komprimierten Bildes (zwischen 0 und 1)
   * @returns {Promise<string>} - Base64-String des komprimierten Bildes
   */
  convertBlobToCompressedBase64(
    blob: Blob,
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Holding proportions
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          // Export image as compressed Base64
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };

        img.onerror = () => reject('Error while loading image.');
        img.src = event.target?.result as string;
      };

      reader.onerror = () => reject('Error while reading blob.');
      reader.readAsDataURL(blob);
    });
  }

  removeImage(index: number) {
    this.taskImages.splice(index, 1);
  }

  
}
