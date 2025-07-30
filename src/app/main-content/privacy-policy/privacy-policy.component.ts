import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';

/**
 * Component for displaying the privacy policy page.
 * This standalone component is rendered via router and displays static content.
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  constructor(private location: Location) {}
  authService = inject(AuthenticationService);

  /**
   * Navigates back to the previous page in browser history.
   */
  goBack() {
    this.location.back();
  }
}
