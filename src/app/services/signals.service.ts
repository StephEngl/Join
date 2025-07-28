import { Injectable, signal } from '@angular/core';
import { TaskImageData } from '../interfaces/task-image-data';
import { UndoImageAction } from '../interfaces/undo-image-action';

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
  isLoggedIn = signal<boolean>(false);

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

  // Signals and methods for task data images
  galleryCurrentIndex = signal<number>(0);
  isGalleryViewerOpen = signal<boolean>(false);

  private readonly _taskImages = signal<TaskImageData[]>([]);
  readonly taskImages = this._taskImages.asReadonly();
  undoStack: UndoImageAction[] = [];

  /**
   * Replaces the entire task images array with the provided images.
   * @param images - Array of TaskImageData to set as current task images
   */
  setTaskImages(images: TaskImageData[]) {
    this._taskImages.set(images);
  }

  /**
   * Adds a new image to the current list of task images.
   * @param image - The TaskImageData object to add
   */
  addTaskImage(image: TaskImageData) {
    this._taskImages.update((current) => [...current, image]);
  }

  /**
   * Clears all task images, setting the list to empty.
   */
  clearTaskImages() {
    this._taskImages.set([]);
  }

  /**
   * Opens the gallery viewer at the specified image index.
   * Sets the current gallery index and marks the viewer as open.
   * @param index - The index at which to open the viewer
   */
  openViewerAt(index: number) {
    this.galleryCurrentIndex.set(index);
    this.isGalleryViewerOpen.set(true);
  }

  /**
   * Triggers a download of the given image by creating a temporary link element.
   * @param image - The TaskImageData to download
   */
  downloadImage(image: TaskImageData) {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image.base64;
    link.download = image.filename;
    link.click();
  }

  /**
   * Removes all task images and stores the current list in the undo stack for possible restore.
   */
  removeAllImages() {
    const current = [...this._taskImages()];
    if (current.length) {
      this.clearUndoStack();
      this.undoStack.push({ type: 'all', images: current });
      this._taskImages.set([]);
    }
  }

  /**
   * Removes a single task image by index and stores it in the undo stack for possible restore.
   * @param index - The index of the image to be removed
   */
  removeTaskImage(index: number) {
    const current = [...this._taskImages()];
    const removed = current[index];
    if (removed) {
      this.undoStack.push({ type: 'single', image: removed, index });
      current.splice(index, 1);
      this._taskImages.set(current);
    }
  }

  /**
   * Undoes the last removal action, restoring either one or all images depending on undo stack entry.
   */
  undoRemoveImage() {
    if (this.undoStack.length > 0) {
      const action = this.undoStack.pop()!;
      if (action.type === 'single') {
        // Restore single image
        const current = [...this._taskImages()];
        current.splice(action.index, 0, action.image);
        this._taskImages.set(current);
      } else if (action.type === 'all') {
        // Restore all images
        this._taskImages.set(action.images);
      }
    }
  }

  /**
   * Returns whether there is an undo action available.
   * @returns True if undoStack is not empty
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Clears the undo stack, removing all stored undo actions.
   */
  clearUndoStack() {
    this.undoStack = [];
  }
}
