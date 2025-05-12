import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignalsService } from '../../services/signals.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);
  usersService = inject(UsersService);
  showDropdown = false;
  isDropdownOpen = false;
  dropdownVisible = false;
  showLogoutPopup = false;
  logoutPopupVisible = false;
  isWideScreen = window.innerWidth > 1920;

  /**
   * Initializes the HeaderComponent.
   * @param router Angular Router for navigation.
   */
  constructor(private router: Router) {}

  /** Sets current user initials. */
  async ngOnInit(){
    await this.authService.setActiveUserInitials();
  }

  /**
   * Handles window resize events to update responsive state.
   * @param event The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isWideScreen = event.target.innerWidth > 1920;
    if (!this.isWideScreen) {
      this.showLogoutPopup = false;
    } else {
      this.showDropdown = false;
    }
  }

  /**
   * Closes dropdown when clicking outside the component.
   */
  @HostListener('document:click')
  handleClickOutside(): void {
    this.closeDropdown();
  }

  /**
   * Handles menu button click events and toggles dropdown or popup.
   * @param event Mouse event from the button click.
   */
  onMenuButtonClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.isWideScreen) {
      this.togglePopup();
      this.closeDropdown();
    } else {
      this.toggleDropdown();
      this.closeLogoutPopup();
    }
  }

  /** Toggles the logout popup visibility. */
  togglePopup() {
    if (this.logoutPopupVisible) {
      this.closeLogoutPopup();
    } else {
      this.openLogoutPopup();
    }
  }

  /** Opens the logout popup with animation. */
  openLogoutPopup() {
    this.logoutPopupVisible = true;
    setTimeout(() => (this.showLogoutPopup = true), 10);
  }

  /** Closes the logout popup with animation. */
  closeLogoutPopup() {
    this.showLogoutPopup = false;
    setTimeout(() => (this.logoutPopupVisible = false), 200);
  }

  /** Toggles the dropdown menu visibility. */
  toggleDropdown() {
    if (this.dropdownVisible) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /** Opens the dropdown menu with animation. */
  openDropdown() {
    this.dropdownVisible = true;
    setTimeout(() => (this.showDropdown = true), 10);
  }

  /** Closes the dropdown menu with animation. */
  closeDropdown() {
    this.showDropdown = false;
    setTimeout(() => (this.dropdownVisible = false), 300);
  }

  /** Logs out the current user and closes the logout popup. */
  logout() {
    this.authService.signOutUser();
    this.showLogoutPopup = false;
  }

  /** Navigates to the summary page. */
  toSummary() {
    this.router.navigate(['/summary']);
  }

  /** Navigates to the login page and resets navigation signals. */
  backToLogin() {
    this.signalService.hideHrefs.set(false);
    this.router.navigate(['login']);
  };


}
