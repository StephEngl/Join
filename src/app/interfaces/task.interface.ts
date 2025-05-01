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

  // NOTE: No changes needed for manual dialog switch.
  // Interface remains unchanged – data is passed via @Input in TaskDialogComponent.
}

// export interface TaskInterface {
//   id?: string;
//   title: string;
//   description: string;
//   category: 'Technical Task' | 'User Story' | undefined;
//   dueDate: Date | null;
//   priority: 'urgent' | 'medium' | 'low';
//   taskType: 'toDo' | 'done' | 'inProgress' | 'feedback';
//   subTasks: any[];
//   assignedTo: any[];
// }
