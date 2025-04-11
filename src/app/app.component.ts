import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SummaryComponent } from './main_content/summary/summary.component';
import { ContactsComponent } from './main_content/contacts/contacts.component';
import { HeaderComponent } from "./shared/header/header.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { TestContactComponent } from "./main_content/contacts/test-contact/test-contact.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SummaryComponent, ContactsComponent, HeaderComponent, NavbarComponent, TestContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
}
