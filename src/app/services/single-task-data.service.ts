import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SingleTaskDataService {

  constructor() { }
    inputFieldSubT: string = '';
    mouseX: number = 0;
    mouseY: number = 0;
    inputTaskTitle: string = '';
    inputTaskDescription: string = '';
    inputTaskDueDate: Date  | null = null;
    today: string = new Date().toISOString().split('T')[0];
    subtaskText = '';
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
    editModeActive: boolean = false;
    currentTaskId: string = "";
}
