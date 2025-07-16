import { Component, Renderer2, inject, HostListener } from '@angular/core';
import { SignalsService } from '../../../../services/signals.service';
import { TaskImageData } from '../../../../interfaces/task-image-data';
import Viewer from 'viewerjs';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
})
export class ImageViewerComponent {
  constructor(private renderer: Renderer2) {}

  viewer: any;
  signalService = inject(SignalsService);

  ngOnInit() {
    const img = this.renderer.selectRootElement('img');
    this.viewer = new Viewer(img, { inline: true });
  }

  get currentIndex() {
    return this.signalService.galleryCurrentIndex();
  }

  get taskImages() {
    return this.signalService.taskImages();
  }

  get currentImage(): TaskImageData | undefined {
    return this.taskImages[this.currentIndex];
  }

  showNextImage() {
    const total = this.taskImages.length;
    const next = (this.currentIndex + 1) % total;
    this.signalService.galleryCurrentIndex.set(next);
    this.viewer?.show(next);
  }

  showPreviousImage() {
    const total = this.taskImages.length;
    const prev = (this.currentIndex - 1 + total) % total;
    this.signalService.galleryCurrentIndex.set(prev);
    this.viewer?.show(prev);
  }

  downloadImage() {
    const image = this.currentImage;
    if (!image) return;
    const link = document.createElement('a');
    link.href = image.base64;
    link.download = image.filename;
    link.click();
  }

  // Keyboard controls
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
