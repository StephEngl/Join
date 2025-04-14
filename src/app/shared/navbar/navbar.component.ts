import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarIconLinkComponent } from './navbar-icon-link/navbar-icon-link.component';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [NavbarIconLinkComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    activeLink: string = '';

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
            route: '/add-task',
            alt: 'Add Task'
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
        // Setze initialen Wert beim Start
        this.activeLink = this.router.url;

        // Reagiere auf NavigationEnd und setze activeLink automatisch
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                this.activeLink = (event as NavigationEnd).urlAfterRedirects;
            });
    }

    setActiveLink(route: string) {
        this.activeLink = route;
    }
}
