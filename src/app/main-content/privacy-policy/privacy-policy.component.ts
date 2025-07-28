import { Component } from '@angular/core';
import { Location } from '@angular/common';

/**
 * Component for displaying the privacy policy page.
 * This standalone component is rendered via router and displays static content.
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
