import { Component, inject, Input } from '@angular/core';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  signalService = inject(SignalsService);
  @Input() isEditMode = false;

    removeImage(index: number) {
    this.signalService.removeTaskImage(index);
  }
}
