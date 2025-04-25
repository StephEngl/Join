import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  toastMessage$ = this.toastService.toastMessage$;
  toastType$ = this.toastService.toastType$;
  isToastAnimated$ = this.toastService.isToastAnimated$;
  isToastOpen$ = this.toastService.isToastOpen$;

  constructor(private toastService: ToastService) { }
}
