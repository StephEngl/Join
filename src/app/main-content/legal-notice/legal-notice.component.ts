import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';

/**
 * Component for displaying the legal notice page.
 * Handles orientation detection (portrait vs. landscape).
 */
@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss',
})
export class LegalNoticeComponent {
  constructor(private location: Location) {}
  authService = inject(AuthenticationService)

  /**
   * Navigates back to the previous page in browser history.
   */
  goBack() {
    this.location.back();
  }

  /**
   * Indicates if the screen is currently in portrait orientation.
   * Set to true when height > width.
   */
  isPortrait = false;

  /**
   * Lifecycle hook that is called after component initialization.
   * Sets up orientation check and adds a resize event listener.
   */
  ngOnInit() {
    this.checkOrientation();
    window.addEventListener('resize', this.checkOrientation.bind(this));
  }

  /**
   * Lifecycle hook that is called just before the component is destroyed.
   * Removes the resize event listener to prevent memory leaks.
   */
  ngOnDestroy() {
    window.removeEventListener('resize', this.checkOrientation.bind(this));
  }

  /**
   * Checks the current window orientation and updates the isPortrait flag.
   * Sets `isPortrait` to true if height is greater than width.
   */
  checkOrientation() {
    this.isPortrait = window.innerHeight > window.innerWidth;
  }
}
