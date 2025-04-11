import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';


@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactDialogComponent, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {


  showDialog = false;

  openAddDialog() {
    console.log('Dialog öffnen');
    this.showDialog = true;
  }

  closeDialog() {
    console.log('Dialog schließen');
    this.showDialog = false;
  }

  handleCreate() {
    this.closeDialog();
  }


}
