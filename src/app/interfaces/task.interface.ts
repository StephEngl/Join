export interface TaskInterface {
    id?: string;
    title: string;
    description: string;
    category: "Technical Task" | "User Story";
    dueDate: Date;
    priority: "urgent" | "medium" | "low";
    taskType: "toDo" | "done" | "inProgress" | "feedback"; 
    subTasks: any[];
    assignedTo: any[];
}