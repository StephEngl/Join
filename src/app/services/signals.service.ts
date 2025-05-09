import { Injectable, signal} from '@angular/core';


/**
 * Service to manage signals related to screen size and form state.
 * 
 * Provides reactive signals to track the screen size (mobile or desktop),
 * form field visibility, and various states related to form handling.
 */
@Injectable({
  providedIn: 'root'
})
export class SignalsService {

  constructor() { 
    this.checkScreenSize();
  }

  isMobile = signal<boolean>(false);
  isDesktop = signal<boolean>(false);
  isInfoShown = signal<boolean>(false);
  formCleared = signal<boolean>(false);
  titleCleared = signal<boolean>(false);
  dateCleared = signal<boolean>(false);
  hideHrefs = signal<boolean>(false);


  /**
   * Checks the current screen width and sets the corresponding mobile or desktop signal.
   * If the window width is 1000px or less, sets the isMobile signal to true and isDesktop to false.
   * Otherwise, sets the isMobile signal to false and isDesktop to true.
   */
  checkScreenSize() {
    if (window.innerWidth <= 1000) {
      this.isMobile.set(true);
      this.isDesktop.set(false);
    } else {
      this.isMobile.set(false);
      this.isDesktop.set(true);
    }
  }

}
