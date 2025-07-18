import { Component, inject, Input } from '@angular/core';
import { SignalsService } from '../../services/signals.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ]
})
export class GalleryComponent {
  signalService = inject(SignalsService);
  @Input() isEditMode = false;

  downloadImage(index: number) {
    const image = this.signalService.taskImages()[index];
    if (image) {
      this.signalService.downloadImage(image);
    }
  }

  removeImage(index: number) {
    this.signalService.removeTaskImage(index);
  }
}
