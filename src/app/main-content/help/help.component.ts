import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent {
  constructor(private location: Location) {}
  authService = inject(AuthenticationService);

  /**
   * Navigates back to the previous page in browser history.
   */
  goBack() {
    this.location.back();
  }
}
