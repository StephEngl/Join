import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  showDropdown = false;
  isDropdownOpen = false;
  dropdownVisible = false;
  showLogoutPopup = false;
  logoutPopupVisible = false;
  isWideScreen = window.innerWidth > 1920;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isWideScreen = event.target.innerWidth > 1920;
    if (!this.isWideScreen) {
      this.showLogoutPopup = false;
    } else {
      this.showDropdown = false;
    }
  }

  @HostListener('document:click')
  handleClickOutside(): void {
    this.closeDropdown();
  }

  onGButtonClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.isWideScreen) {
      this.togglePopup();
      this.closeDropdown();
    } else {
      this.toggleDropdown();
      this.closeLogoutPopup();
    }
  }

  togglePopup() {
    if (this.logoutPopupVisible) {
      this.closeLogoutPopup();
    } else {
      this.openLogoutPopup();
    }
  }

  openLogoutPopup() {
    this.logoutPopupVisible = true;
    setTimeout(() => (this.showLogoutPopup = true), 10);
  }

  closeLogoutPopup() {
    this.showLogoutPopup = false;
    setTimeout(() => (this.logoutPopupVisible = false), 200);
  }

  toggleDropdown() {
    if (this.dropdownVisible) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.dropdownVisible = true;
    setTimeout(() => (this.showDropdown = true), 10);
  }

  closeDropdown() {
    this.showDropdown = false;
    setTimeout(() => (this.dropdownVisible = false), 300);
  }

  logout() {
    // Logout-Logik
    this.showLogoutPopup = false;
  }
}
