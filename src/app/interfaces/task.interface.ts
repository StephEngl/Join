import { Data } from "@angular/router";

export interface TaskInterface {
    id?: string;
    title: string;
    description: string;
    category: string;
    dueDate: Date;
    priority: "critical" | "medium" | "trivial";
    taskType: "toDo" | "done" | "inProgress" | "feedback"; // bleibt
    subTasks: any[];
    assignedTo: any[];
}