import { Component, Renderer2, inject } from '@angular/core';
import Viewer from 'viewerjs';
import { SignalsService } from '../../../../services/signals.service';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
})
export class ImageViewerComponent {
  constructor(private renderer: Renderer2) {}

  signalService = inject(SignalsService); 
  viewer: any;
  imageSources = [
    '../../../assets/images/image-1.jpg',
    '../../../assets/images/image-2.jpg',
    '../../../assets/images/image-3.jpg',
    '../../../assets/images/image-4.jpg',
    '../../../assets/images/image-5.jpg',
    '../../../assets/images/image-6.jpg',
    '../../../assets/images/image-7.jpg',
  ];
  currentIndex = 0;

  ngOnInit() {
    const img = this.renderer.selectRootElement('img');
    this.viewer = new Viewer(img, { inline: true });
  }

  showNextImage() {
    this.currentIndex++;
    if (this.currentIndex >= this.imageSources.length) {
      this.currentIndex = 0;
    }
    this.viewer.show(this.currentIndex);
  }

  showPreviousImage() {
    this.currentIndex--;
    if (this.currentIndex <= 0) {
      this.currentIndex = this.imageSources.length - 1;
    }
    this.viewer.show(this.currentIndex);
  }
}
