import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { DailyResetService } from './services/daily-reset.service';
import { ToastComponent } from './shared/toast/toast.component';
import { SignalsService } from './services/signals.service';
import { AuthenticationService } from './services/authentication.service';


/**
 * The root component of the application.
 * Initializes global services such as daily reset checks and user authentication state.
 * Also injects shared UI components like header, navbar, and toast notifications.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  dailyReset = inject(DailyResetService);
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);


  /**
   * Initializes the component and triggers the daily reset after a short delay.
   */
  constructor() {
    setTimeout(() => {
      this.dailyReset.checkAndResetIfNeeded();
    }, 1000);
  }

  /**
   * Angular lifecycle hook that runs after the component has been initialized.
   * Used here to set the active user's initials in the UI.
   */
  ngOnInit() {
    this.authService.setActiveUserInitials();
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode');
  }

}
