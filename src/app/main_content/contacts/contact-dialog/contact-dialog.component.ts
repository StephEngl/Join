import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactInterface } from '../../../interfaces/contact.interface';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit, OnDestroy {
  @Output() cancel = new EventEmitter<void>();
  @Input()contactName: string | undefined;
  @Input()contactMail: string | undefined;
  @Input()contactPhone: string | undefined;

  animateIn = false;
  animateOut = false;

  contactData: ContactInterface  = {
    name: '',
    mail: '',
    phone: ''
  } 

  ngOnInit(): void {
    this.contactData.name = this.contactName || '';
    this.contactData.mail = this.contactMail || '';
    this.contactData.phone = this.contactPhone || '';
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
