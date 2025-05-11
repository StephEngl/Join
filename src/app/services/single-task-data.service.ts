import { Injectable } from '@angular/core';

/**
 * Service to manage task-related data in the application.
 * 
 * Provides methods and properties to store and manipulate task input data,
 * priority settings, subtasks, and task status.
 */
@Injectable({
    providedIn: 'root'
})
export class SingleTaskDataService {

    constructor() { }

    inputFieldSubT: string = '';
    inputTaskTitle: string = '';
    inputTaskDescription: string = '';
    inputTaskDueDate: Date  | null = null;
    today: string = new Date().toISOString().split('T')[0];
    subtaskText = '';
    editModeActive: boolean = false;
    taskStatus: 'toDo' | 'inProgress' | 'feedback' = 'toDo';
    subtasksContainer: {
        text: string;
        isEditing: boolean;
        isHovered: boolean;
        isChecked: boolean;
    }[] = [];
    assignedTo: any[] = [];
    taskCategories: any[] = ['Technical Task', 'User Story'];
    selectedCategory: 'Technical Task' | 'User Story' | undefined = undefined;
    priorityButtons: {
        imgInactive: string;
        imgActive: string;
        colorActive: string;
        priority: 'Urgent' | 'Medium' | 'Low';
        btnActive: boolean;
    }[] = [
        {
            imgInactive: './assets/icons/kanban/prio_urgent.svg',
            imgActive: './assets/icons/kanban/prio_urgent_white.svg',
            colorActive: '#FF3D00',
            priority: 'Urgent',
            btnActive: false,
        },
        {
            imgInactive: './assets/icons/kanban/prio_medium.svg',
            imgActive: './assets/icons/kanban/prio_medium_white.svg',
            colorActive: '#FFA800',
            priority: 'Medium',
            btnActive: false,
        },
        {
            imgInactive: './assets/icons/kanban/prio_low.svg',
            imgActive: './assets/icons/kanban/prio_low_white.svg',
            colorActive: '#7AE229',
            priority: 'Low',
            btnActive: false,
        },
    ];

    /**
     * Resets all priority buttons to their inactive state,
     * and sets the medium priority button to active.
     */
    resetAllPrioBtns() {
        this.priorityButtons.forEach((p) => (p.btnActive = false));
        this.priorityButtons[1].btnActive = true;
    }

    /**
     * Clears all task data and resets the state to its initial values.
     */
    clearData() {
        this.inputTaskTitle = '';
        this.inputTaskDescription = '';
        this.inputTaskDueDate = null;
        this.subtaskText = '';
        this.subtasksContainer = [];
        this.assignedTo = [];
        this.resetAllPrioBtns();
        this.selectedCategory = undefined;
    }

}
