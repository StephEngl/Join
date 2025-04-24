import { Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignalsService {

  constructor() { 
    this.checkScreenSize();
  }

  isMobile = signal<boolean>(false);
  isDesktop = signal<boolean>(false);
  isInfoShown= signal<boolean>(false);

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
