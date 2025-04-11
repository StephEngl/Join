import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit, OnDestroy {
  @Output() cancel = new EventEmitter<void>();

  animateIn = false;
  animateOut = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.animateIn = true;
    }, 10);
  }

  ngOnDestroy(): void {
    this.animateIn = false;
    this.animateOut = false;
  }

  onCancel(): void {
    this.animateIn = false;
    this.animateOut = true;
    setTimeout(() => {
      this.cancel.emit();
    }, 400);
  }

  onOverlayClick(): void {
    this.onCancel();
  }

  onCreate() {

  }
}
