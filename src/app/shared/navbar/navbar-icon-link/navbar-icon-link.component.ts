import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SingleTaskDataService } from '../../../services/single-task-data.service';

@Component({
    selector: 'app-navbar-icon-link',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './navbar-icon-link.component.html',
    styleUrl: './navbar-icon-link.component.scss'
})

/**
 * A standalone component representing a clickable navigation icon within the app's navbar.
 * It displays a different icon depending on whether it's active, and emits an activation event when clicked.
 * Also resets the edit mode state in the `SingleTaskDataService`.
 */
export class NavbarIconLinkComponent {  
    taskDataService = inject(SingleTaskDataService);
    @Input() iconUnclicked!: string;
    @Input() iconClicked!: string;
    @Input() route!: string;
    @Input() alt!: string;
    @Input() isActive: boolean = false;
    @Output() activate = new EventEmitter<string>();

    /** Handles click events by emitting the route and deactivating edit mode. */
    onClick() {
        this.activate.emit(this.route);
        this.taskDataService.editModeActive = false;
    }

    /** Returns the appropriate icon based on the current active state. */
    get currentIcon(): string {
        return this.isActive ? this.iconClicked : this.iconUnclicked;
    }
}
