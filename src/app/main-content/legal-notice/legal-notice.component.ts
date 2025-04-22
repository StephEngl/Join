import { Component } from '@angular/core';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {

  isPortrait = false;

  ngOnInit() {
    this.checkOrientation();
    window.addEventListener('resize', this.checkOrientation.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkOrientation.bind(this));
  }

  checkOrientation() {
    this.isPortrait = window.innerHeight > window.innerWidth;
  }
  
}
