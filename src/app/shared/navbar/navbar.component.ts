import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarIconLinkComponent } from './navbar-icon-link/navbar-icon-link.component';
import { SignalsService } from '../../services/signals.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NavbarIconLinkComponent, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  activeLink: string = '';
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);

  links = [
    {
      iconUnclicked: 'assets/icons/navbar/summary_inactive.svg',
      iconClicked: 'assets/icons/navbar/summary.svg',
      route: '/summary',
      alt: 'Summary',
    },
    {
      iconUnclicked: 'assets/icons/navbar/new_task_inactive.svg',
      iconClicked: 'assets/icons/navbar/new_task.svg',
      route: '/addtask',
      alt: 'Add\u00A0Task',
    },
    {
      iconUnclicked: 'assets/icons/navbar/board_inactive.svg',
      iconClicked: 'assets/icons/navbar/board.svg',
      route: '/board',
      alt: 'Board',
    },
    {
      iconUnclicked: 'assets/icons/navbar/contacts_inactive.svg',
      iconClicked: 'assets/icons/navbar/contacts.svg',
      route: '/contacts',
      alt: 'Contacts',
    },
  ];

  /**
   * Handles routing logic, active link tracking, and navigation behaviors within the application.
   */
  constructor(private router: Router) {
    /**
     * Subscribes to router navigation events to track the current active URL.
     * Updates the `activeLink` property whenever a navigation ends.
     */
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.activeLink = url;
      });
  }

  /**
   * Sets the current active navigation link and optionally hides the contact info panel.
   * @param route - The route path to set as active.
   */
  setActiveLink(route: string) {
    if (this.activeLink === '/contacts') {
      this.signalService.isInfoShown.set(false);
    }
    this.activeLink = route;
  }

  /** Navigates the application to the summary page. */
  toSummary() {
    this.router.navigate(['/summary']);
  }

  /** Navigates back to the login page and ensures header links are visible again. */
  backToLogin() {
    this.signalService.hideHrefs.set(false);
    this.router.navigate(['login']);
  }
}
