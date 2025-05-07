import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../services/signals.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  signalService = inject(SignalsService);
  constructor(private router: Router) {}

  toMain() {
    this.signalService.dummyAuthStatus.set(true);
    this.router.navigate(['/summary']);
  }

}
