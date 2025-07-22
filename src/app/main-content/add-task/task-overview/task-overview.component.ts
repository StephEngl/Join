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
import { GalleryComponent } from '../../../shared/gallery/gallery.component';

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [FormsModule, CommonModule, CdkAccordionModule, GalleryComponent],
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
  isDragOver: Boolean = false;

  @Input() taskData!: TaskInterface;
  @Input() today: string = new Date().toISOString().split('T')[0];

  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;

  ngOnInit() {
    this.setFormData();
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

  /**
   * Handles the selection of files from a file input event.
   * Only allows image files and processes each file individually.
   * @param event - The file input change event
   */
  async onFileSelected(event: Event) {
    const files = this.getFilesFromEvent(event);
    if (!files) return;
    for (const file of files) {
      if (!this.isImageFile(file)) {
        this.showFileTypeError();
        return;
      }
      await this.processImageFile(file);
    }
  }

  /**
   * Extracts FileList from input event or returns null if not found.
   * @param event - The file input event
   * @returns Array of File objects or null
   */
  private getFilesFromEvent(event: Event): File[] | null {
    const input = event.target as HTMLInputElement;
    return input.files ? Array.from(input.files) : null;
  }

  /**
   * Checks if the provided file is an image.
   * @param file - The file to check
   * @returns True if file is an image type
   */
  private isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Shows a toast error when a non-image file is selected.
   */
  private showFileTypeError(): void {
    this.toastService.triggerToast('Incorrect file-type. Please load image', 'error');
  }

  /**
   * Attempts to process an image file:
   * - Compresses it to Base64
   * - Adds the image to the task
   * - Shows an error toast if processing fails
   * @param file - Image file to process
   */
  private async processImageFile(file: File): Promise<void> {
    try {
      const compressedBase64 = await this.convertBlobToCompressedBase64(file, 800, 800, 0.8);
      const image: TaskImageData = {
        filename: file.name,
        fileType: file.type,
        size: file.size,
        base64: compressedBase64,
      };
      this.signalService.addTaskImage(image);
    } catch (error) {
      console.error('Error while adding image:', error);
      this.toastService.triggerToast(`Error while processing ${file.name}: ${(error as Error).message}`, 'error');
    }
  }

  /**
   * Compresses an image Blob to a Base64-encoded JPEG string.
   * @param blob - Source image as a Blob
   * @param maxWidth - Maximum output width
   * @param maxHeight - Maximum output height
   * @param quality - JPEG quality (0...1)
   * @returns Promise resolving to compressed Base64 string
   */
  async convertBlobToCompressedBase64(
    blob: Blob,
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<string> {
    const base64 = await this.readBlobAsDataURL(blob);
    const img = await this.loadImage(base64);
    const { width, height } = this.getScaledDimensions(img, maxWidth, maxHeight);
    const ctx = this.createCanvasContext(width, height);
    ctx.drawImage(img, 0, 0, width, height);
    const outputType = blob.type || 'image/png';
    return ctx.canvas.toDataURL(outputType, quality);
  }

  /**
   * Reads a Blob as a Base64 Data URL.
   * @param blob - The image Blob
   * @returns Promise resolving to Base64 string
   */
  readBlobAsDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject('Error while reading image blob.');
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Loads an image from a Base64 URL for further processing.
   * @param base64 - The Base64 image string
   * @returns Promise resolving to a loaded HTMLImageElement
   */
  loadImage(base64: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject('Error loading image.');
      img.src = base64;
    });
  }

  /**
   * Calculates scaled dimensions while maintaining aspect ratio.
   * @param img - The loaded Image
   * @param maxWidth - Maximum allowed width
   * @param maxHeight - Maximum allowed height
   * @returns Object with target width and height
   */
  getScaledDimensions(
    img: HTMLImageElement,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = img;
    if (width > maxWidth || height > maxHeight) {
      if (width / height > maxWidth / maxHeight) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      } else {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
    }
    return { width, height };
  }

  /**
   * Creates a 2D canvas context of the given size.
   * @param width - Canvas width
   * @param height - Canvas height
   * @returns 2D rendering context
   */
  createCanvasContext(width: number, height: number): CanvasRenderingContext2D {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context could not be created.');
    return ctx;
  }

  // Drag & Drop
  /**
   * Prevents the default browser behavior when a file is dragged over the drop area.
   * @param event - The drag over event
   */
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  /**
   * Handles file drop events: prevents default browser behavior,
   * processes dropped files, and resets the drag-over state.
   * @param event - The drop event containing the files
   */
  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.onFileSelected({ target: { files } } as any);
    }
    this.isDragOver = false;
  }
}
