import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskDialogService {
isAddTaskDialog: boolean = true;
showAddTaskDialog: boolean = true;

  constructor() { }
}
