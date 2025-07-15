import { TaskImageData } from "./task-image-data";

export interface TaskInterface {
  id?: string;
  title: string;
  description: string;
  category: 'Technical Task' | 'User Story' | undefined;
  dueDate: Date | null;
  priority: 'urgent' | 'medium' | 'low';
  taskType: 'toDo' | 'done' | 'inProgress' | 'feedback';
  subTasks: any[];
  assignedTo: any[];
  images?: TaskImageData[];
}
