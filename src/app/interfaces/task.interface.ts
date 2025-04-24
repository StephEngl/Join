export interface TaskInterface {
    id?: string;
    title: string;
    description: string;
    category: string;
    dueDate: Date;
    priority: "urgent" | "medium" | "low"; // edit firebase and services to this
    taskType: "toDo" | "done" | "inProgress" | "feedback"; 
    subTasks: any[];
    assignedTo: any[];
}