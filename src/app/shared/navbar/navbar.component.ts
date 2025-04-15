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

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                const url = (event as NavigationEnd).urlAfterRedirects;
                this.activeLink = url;
                console.log('🧭 Navigiert zu:', url); // ✅ zeigt dir den aktiven Pfad
            });
        // this.router.events
        //     .pipe(filter(event => event instanceof NavigationEnd))
        //     .subscribe(() => {
        //         this.activeLink = this.router.url;
        //     });
    }

    setActiveLink(route: string) {
        this.activeLink = route;
    }
}
