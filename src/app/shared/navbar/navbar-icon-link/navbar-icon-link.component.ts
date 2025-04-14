import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar-icon-link',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './navbar-icon-link.component.html',
    styleUrl: './navbar-icon-link.component.scss'
})
export class NavbarIconLinkComponent {
    @Input() iconUnclicked!: string;
    @Input() iconClicked!: string;
    @Input() route!: string;
    @Input() alt!: string;
    @Input() isActive: boolean = false;

    @Output() activate = new EventEmitter<string>();

    onClick() {
        this.activate.emit(this.route);
    }

    get currentIcon(): string {
        return this.isActive ? this.iconClicked : this.iconUnclicked;
    }
}
