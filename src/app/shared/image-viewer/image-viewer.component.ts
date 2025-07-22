import {
  Component,
  Renderer2,
  inject,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SignalsService } from '../../services/signals.service';
import { TaskImageData } from '../../interfaces/task-image-data';
import Viewer from 'viewerjs';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
})
export class ImageViewerComponent {
  constructor(private renderer: Renderer2) {}

  signalService = inject(SignalsService);
  viewer: any;
  zoom: number = 1;
  maxZoom = 2;
  minZoom = 0.2;
  translateX = 0;
  translateY = 0;
  dragging = false;
  lastX = 0;
  lastY = 0;

  @ViewChild('imgViewer', { static: false })
  imgViewer!: ElementRef<HTMLImageElement>;

  /**
   * Initializes the image viewer after the view has been initialized.
   * Creates a new Viewer instance for the referenced image element.
   */
  ngAfterViewInit() {
    if (this.imgViewer?.nativeElement) {
      this.viewer = new Viewer(this.imgViewer.nativeElement, { inline: true });
    }
  }

  /**
   * Cleans up resources before the component is destroyed.
   * Destroys the Viewer instance if it exists to prevent memory leaks.
   */
  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }

  /**
   * Gets the current image index from the signal service.
   */
  get currentIndex() {
    return this.signalService.galleryCurrentIndex();
  }

  /**
   * Gets the array of task images from the signal service.
   */
  get taskImages() {
    return this.signalService.taskImages();
  }

  /**
   * Gets the currently selected image data or undefined if none selected.
   */
  get currentImage(): TaskImageData | undefined {
    return this.taskImages[this.currentIndex];
  }

  /**
   * Advances to the next image in the gallery, wrapping around at the end.
   * Updates the current index in the signal service and instructs the viewer to show it.
   */
  showNextImage() {
    const total = this.taskImages.length;
    const next = (this.currentIndex + 1) % total;
    this.signalService.galleryCurrentIndex.set(next);
    this.viewer?.show(next);
  }

  /**
   * Moves to the previous image in the gallery, wrapping around to the last image if at the start.
   * Updates the current index and viewer accordingly.
   */
  showPreviousImage() {
    const total = this.taskImages.length;
    const prev = (this.currentIndex - 1 + total) % total;
    this.signalService.galleryCurrentIndex.set(prev);
    this.viewer?.show(prev);
  }

  /**
   * Triggers download of the current image via the signal service.
   */
  downloadImage() {
    const image = this.currentImage;
    if (image) {
      this.signalService.downloadImage(image);
    }
  }

  /**
   * Zooms in by increasing zoom factor, capped at maxZoom.
   */
  zoomIn() {
    this.zoom = Math.min(this.maxZoom, this.zoom + 0.1);
  }

  /**
   * Zooms out by decreasing zoom factor, limited by minZoom.
   */
  zoomOut() {
    this.zoom = Math.max(this.minZoom, this.zoom - 0.1);
  }

  /**
   * Resets zoom and image translation (pan) to default centered state.
   */
  resetZoom() {
    this.zoom = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  // Drag & Drop methods for zoomed images

  /**
   * Starts image drag operation on pointer down.
   * Captures pointer and stores initial position.
   * @param event - The pointer down event
   */
  onDragStart(event: PointerEvent) {
    event.preventDefault();
    this.dragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  /**
   * Handles pointer move events during dragging.
   * Updates translation offsets based on pointer movement.
   * @param event - The pointer move event
   */
  onDragMove(event: PointerEvent) {
    if (!this.dragging) return;
    event.preventDefault();
    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;
    this.translateX += dx;
    this.translateY += dy;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  /**
   * Ends dragging operation on pointer up or cancellation.
   * Releases pointer capture and resets dragging state.
   * @param event - The pointer up or cancel event (optional)
   */
  onDragEnd(event?: PointerEvent) {
    if (this.dragging && event) {
      (event.target as HTMLElement).releasePointerCapture(event.pointerId);
    }
    this.dragging = false;
  }

  // Keyboard controls

  /**
   * Listens to keydown events for gallery navigation and closing.
   * Right Arrow: next image
   * Left Arrow: previous image
   * Escape: closes the gallery viewer
   * @param event - The keyboard event
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (!this.signalService.isGalleryViewerOpen()) return;

    if (event.key === 'ArrowRight') {
      this.showNextImage();
    } else if (event.key === 'ArrowLeft') {
      this.showPreviousImage();
    } else if (event.key === 'Escape') {
      this.signalService.isGalleryViewerOpen.set(false);
    }
  }
}
