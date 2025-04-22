import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  title = 'join';

  constructor() {}

  isMobileLandscape = false;

  @HostListener('window:resize')
  onResize() {
    this.checkOrientation();
  }

  ngOnInit() {
    this.checkOrientation();
  }

  private checkOrientation(): void {
    const isMobile = window.innerWidth <= 1024;
    const isLandscape = window.innerWidth > window.innerHeight;
    this.isMobileLandscape = isMobile && isLandscape;
  }
}
