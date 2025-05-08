import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarIconLinkComponent } from './navbar-icon-link/navbar-icon-link.component';
import { SignalsService } from '../../services/signals.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [NavbarIconLinkComponent, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    activeLink: string = '';
    signalService = inject(SignalsService);
    authService = inject(AuthenticationService);

    links = [
        {
            iconUnclicked: 'assets/icons/navbar/summary_inactive.svg',
            iconClicked: 'assets/icons/navbar/summary.svg',
            route: '/summary',
            alt: 'Summary'
        },
        {
            iconUnclicked: 'assets/icons/navbar/new_task_inactive.svg',
            iconClicked: 'assets/icons/navbar/new_task.svg',
            route: '/addtask',
            alt: 'Add\u00A0Task'
        },
        {
            iconUnclicked: 'assets/icons/navbar/board_inactive.svg',
            iconClicked: 'assets/icons/navbar/board.svg',
            route: '/board',
            alt: 'Board'
        },
        {
            iconUnclicked: 'assets/icons/navbar/contacts_inactive.svg',
            iconClicked: 'assets/icons/navbar/contacts.svg',
            route: '/contacts',
            alt: 'Contacts'
        }
    ];

    constructor(private router: Router) {

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                const url = (event as NavigationEnd).urlAfterRedirects;
                this.activeLink = url;
            });
        // this.router.events
        //     .pipe(filter(event => event instanceof NavigationEnd))
        //     .subscribe(() => {
        //         this.activeLink = this.router.url;
        //     });
    }

    setActiveLink(route: string) {
        if (this.activeLink === "/contacts") {
            this.signalService.isInfoShown.set(false)
        }
        this.activeLink = route;
    }

    toSummary() {
        this.router.navigate(['/summary']);
    };

    backToLogin() {
        this.signalService.hideHrefs.set(false);
        this.router.navigate(['login']);
    };

}
