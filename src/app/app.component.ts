import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { DailyResetService } from './services/daily-reset.service';
import { ToastComponent } from './shared/toast/toast.component';
import { LoginComponent } from './login/login.component';
import { SignalsService } from './services/signals.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavbarComponent, ToastComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  dailyReset = inject(DailyResetService);
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);


  constructor() {
    setTimeout(() => {
      this.dailyReset.checkAndResetIfNeeded();
    }, 1000);
  }

  ngOnInit() {
    this.authService.setActiveUserInitials();
  }

  

}
