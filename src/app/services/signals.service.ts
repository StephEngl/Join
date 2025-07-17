import { Injectable, signal } from '@angular/core';
import { TaskImageData } from '../interfaces/task-image-data';

/**
 * Service to manage signals related to screen size and form state.
 *
 * Provides reactive signals to track the screen size (mobile or desktop),
 * form field visibility, and various states related to form handling.
 */
@Injectable({
  providedIn: 'root',
})
export class SignalsService {
  constructor() {
    this.checkScreenSize();
  }

  isMobile = signal<boolean>(false);
  isDesktop = signal<boolean>(false);
  isInfoShown = signal<boolean>(false);
  formCleared = signal<boolean>(false);
  titleCleared = signal<boolean>(false);
  dateCleared = signal<boolean>(false);
  hideHrefs = signal<boolean>(false);
  signingIn = signal<boolean>(true);
  hasAnimated = false;
  
  /**
   * Checks the current screen width and sets the corresponding mobile or desktop signal.
   * If the window width is 1000px or less, sets the isMobile signal to true and isDesktop to false.
   * Otherwise, sets the isMobile signal to false and isDesktop to true.
  */
 checkScreenSize() {
    if (window.innerWidth <= 1000) {
      this.isMobile.set(true);
      this.isDesktop.set(false);
    } else {
      this.isMobile.set(false);
      this.isDesktop.set(true);
    }
  }
  
  // Signal and methods for task data images
  galleryCurrentIndex = signal<number>(0);
  isGalleryViewerOpen = signal<boolean>(false);

  private readonly _taskImages = signal<TaskImageData[]>([]);
  readonly taskImages = this._taskImages.asReadonly();
  private undoStack: { image: TaskImageData, index: number }[] = [];

  setTaskImages(images: TaskImageData[]) {
    this._taskImages.set(images);
  }

  addTaskImage(image: TaskImageData) {
    this._taskImages.update((current) => [...current, image]);
  }

  // removeTaskImage(index: number) {
  //   this._taskImages.update((current) =>
  //     current.filter((_, i) => i !== index)
  //   );
  // }

  clearTaskImages() {
    this._taskImages.set([]);
  }

  openViewerAt(index: number) {
    this.galleryCurrentIndex.set(index);
    this.isGalleryViewerOpen.set(true);
  }

  removeTaskImage(index: number) {
    const current = [...this._taskImages()];
    const removed = current[index];
    if (removed) {
      this.undoStack.push({ image: removed, index });
      current.splice(index, 1);
      this._taskImages.set(current);
    }
  }

  undoRemoveImage() {
    if (this.undoStack.length > 0) {
      const { image, index } = this.undoStack.pop()!;
      const current = [...this._taskImages()];
      current.splice(index, 0, image);
      this._taskImages.set(current);
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  clearUndoStack() {
    this.undoStack = [];
  }
}
