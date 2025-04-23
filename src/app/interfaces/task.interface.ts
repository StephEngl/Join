import { Data } from "@angular/router";

export interface TaskInterface {
    id?: string;
    title: string;
    description: string;
    category: string;
    dueDate: Date;
    priority: string;
    subTasks: string[];
    assignedTo: string[];
}