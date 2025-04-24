import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { DailyResetService } from './services/daily-reset.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  dailyReset = inject(DailyResetService);

  constructor() {
    setTimeout(() => {
      this.dailyReset.checkAndResetIfNeeded();
    }, 1000);

  }

}
