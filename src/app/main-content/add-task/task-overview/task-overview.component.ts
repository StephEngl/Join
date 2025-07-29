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
  allowedMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

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

  /** Images and Gallery Viewer methods */

  /**
   * Handles the selection of files from a file input event.
   * Only allows image files and processes each file individually.
   * @param event - The file input change event
   */
  async onFileSelected(event: Event) {
    const files = this.getFilesFromEvent(event);
    if (!files) return;
    const maxAllowedImages = 5;
    if (this.signalService.taskImages().length + files.length > maxAllowedImages) {
      this.toastService.triggerToast(`You can upload a maximum of ${maxAllowedImages} images`, 'error')
      return;
    }
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
    this.toastService.triggerToast(
      'Incorrect file-type. Please load image (JPEG, SVG, WebP, PNG)',
      'error'
    );
  }

  /**
   * Attempts to process an image file by compressing it,
   * then adds it to the task or shows an error toast on failure.
   * @param file - The image file to process.
   */
  private async processImageFile(file: File): Promise<void> {
    try {
      let targetType = file.type === 'image/png' ? 'image/jpeg' : file.type;
      const { base64, size } = await this.compressWithSizeLimit(file, 150 * 1024, targetType);

      if (size > 150 * 1024) {
        this.toastService.triggerToast('Error: Image is too large', 'error');
      } else {
        const filename = targetType === 'image/jpeg' ? file.name.replace(/\.png$/i, '.jpg') : file.name;

        this.signalService.addTaskImage({
          filename,
          fileType: targetType,
          size,
          base64,
        });
      }
    } catch (error) {
      console.error('Error while adding image:', error);
      this.toastService.triggerToast(`Error while adding image`, 'error');
    }
  }

  /**
  * Compresses an image file with iterative quality reduction
  * and optional resizing to meet a maximum size limit.
  * @param file - The image file to compress.
  * @param maxSize - Maximum allowed size in bytes.
  * @param targetType - Desired output MIME type (e.g., "image/jpeg").
  * @returns Object containing the Base64 string and the compressed size in bytes.
  */
  async compressWithSizeLimit(file: File, maxSize: number, targetType: string): Promise<{ base64: string; size: number }> {
    let quality = 0.8;
    let result = await this.compressAndGetSize(file, 800, 800, quality, targetType);

    while (result.size > maxSize && quality > 0.5) {
      quality -= 0.1;
      result = await this.compressAndGetSize(file, 800, 800, quality, targetType);
    }

    if (result.size > maxSize) {
      result = await this.compressAndGetSize(file, 600, 600, quality, targetType);
    }

    return result;
  }

  /**
  * Compresses a Blob to a Base64-encoded image string with specified dimensions, quality, and format,
  * and calculates its byte size.
  * @param blob - The image blob to compress.
  * @param maxWidth - Maximum output width in pixels.
  * @param maxHeight - Maximum output height in pixels.
  * @param quality - Compression quality from 0 (lowest) to 1 (highest).
  * @param outputType - MIME type for output (e.g., "image/jpeg").
  * @returns Object containing the Base64-encoded string and its size in bytes.
  */
  async compressAndGetSize(blob: Blob, maxWidth: number, maxHeight: number, quality: number, outputType: string): Promise<{ base64: string; size: number }> {
    const base64 = await this.convertBlobToCompressedBase64(blob, maxWidth, maxHeight, quality, outputType);
    const base64String = base64.split(',')[1] ?? '';
    const size = Math.round((base64String.length * 3) / 4);
    return { base64, size };
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
    quality: number = 0.8,
    outputType = blob.type
  ): Promise<string> {
    const base64 = await this.readBlobAsDataURL(blob);
    const img = await this.loadImage(base64);
    const { width, height } = this.getScaledDimensions(
      img,
      maxWidth,
      maxHeight
    );
    const ctx = this.createCanvasContext(width, height);

    if (outputType === 'image/jpeg') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);
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

  /** Drag & Drop */

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
      const filteredFiles = Array.from(files).filter((file) =>
        this.allowedMimeTypes.includes(file.type)
      );

      if (filteredFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        filteredFiles.forEach((file) => dataTransfer.items.add(file));

        this.onFileSelected({ target: { files: dataTransfer.files } } as any);
      } else {
        this.toastService.triggerToast(
          'Wrong image-type. Please, use JPG, PNG, SVG or WebP.',
          'error'
        );
      }
    }
    this.isDragOver = false;
  }
}
