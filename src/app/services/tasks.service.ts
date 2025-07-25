import { Injectable, inject } from '@angular/core';
import { TaskInterface } from '../interfaces/task.interface';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  DocumentReference,
} from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';

/**
 * Service for managing tasks in Firestore.
 * Provides methods to subscribe to tasks, add, update, delete tasks and manage subtasks.
 */
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  firestore: Firestore = inject(Firestore);
  tasks: TaskInterface[] = [];
  auth = inject(AuthenticationService);
  unsubscribeTasks?: () => void;

  constructor() {
      if (!this.unsubscribeTasks) {
      this.unsubscribeTasks = this.subTasksList();
    };
  }

  /**
   * Initializes the Firestore subscription for tasks if not already started.
   */
  initTasksService() {
    if (!this.unsubscribeTasks) {
      this.unsubscribeTasks = this.subTasksList();
    }
  }

  /**
   * Unsubscribes from the Firestore tasks listener to prevent memory leaks.
   */
  stopTasksService() {
    if (this.unsubscribeTasks) {
      this.unsubscribeTasks();
    }
  }

  /**
   * Subscribes to task changes in Firestore, ordered by priority.
   */
  subTasksList() {
    const q = query(this.getTasksRef(), orderBy('priority'));
    return onSnapshot(
      q,
      (snapshot) => {
        this.tasks = [];
        snapshot.forEach((element) => {
          const task = element.data();
          this.tasks.push(this.setTaskObject(element.id, task));
        });
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  /**
   * Loads tasks from Firestore.
   * @returns A promise that resolves when tasks are loaded.
   */
  async loadTasks(): Promise<void> {
    try {
      const snapshot = await getDocs(this.getTasksRef());
      const tasks: TaskInterface[] = [];

      snapshot.forEach((docSnap) => {
        const contact = docSnap.data();
        tasks.push(this.setTaskObject(docSnap.id, contact));
      });
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  /**
   * Returns the total count of tasks.
   */
  tasksCount() {
    return this.tasks.length;
  }

  /**
   * Returns the count of tasks of a specific type.
   * @param typeInput The type of task to count.
   * @returns The number of tasks of the given type.
   */
  tasksByType(typeInput: string): number {
    return this.tasks.filter((task) => task.taskType === typeInput).length;
  }

  /**
   * Returns the count of tasks with a specific priority.
   * @param priorityInput The priority level to filter by.
   * @returns The number of tasks with the specified priority.
   */
  tasksByPriority(priorityInput: string): number {
    return this.tasks.filter((task) => task.priority === priorityInput).length;
  }

  /**
   * Returns the Firestore collection reference for tasks.
   */
  getTasksRef() {
    return collection(this.firestore, 'tasks');
  }

  /**
   * Returns a Firestore document reference for a specific task ID.
   * @param docId - ID of the task document.
   */
  getSingleDocRef(docId: string) {
    return doc(this.getTasksRef(), docId);
  }

  /**
   * Converts raw Firestore data into a TaskInterface object.
   * @param id The task document ID.
   * @param taskData The Firestore document data.
   * @returns A TaskInterface object with the task data.
   */
  setTaskObject(id: string, taskData: any): TaskInterface {
    return {
      id: id,
      title: taskData.title || '',
      description: taskData.description || '',
      category: taskData.category || '',
      dueDate: taskData.dueDate?.toDate?.() || new Date(),
      priority: taskData.priority || '',
      taskType: taskData.taskType || 'toDo',
      subTasks: taskData.subTasks || [],
      assignedTo: taskData.assignedTo || [],
      images: taskData.images || [],
    };
  }

  /**
   * Adds a new task to Firestore.
   * @param task The task object to add.
   * @returns A promise that resolves with the document reference of the added task.
   */
  async addTask(task: TaskInterface): Promise<void | DocumentReference> {
    try {
      const taskRef = await addDoc(this.getTasksRef(), task);
      return taskRef;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Deletes a task from Firestore by ID.
   * @param docId The ID of the task to delete.
   */
  async deleteTask(docId: string) {
    try {
      await deleteDoc(this.getSingleDocRef(docId));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Updates a task in Firestore.
   * @param task The updated task object.
   */
  async updateTask(task: TaskInterface) {
    if (task.id) {
      try {
        let docRef = this.getSingleDocRef(task.id);
        await updateDoc(docRef, this.getCleanJson(task));
      } catch (err) {
        console.error(err);
      }
    }
  }

  /**
   * Updates the status of a subtask in Firestore.
   * @param task The task object with updated subtask status.
   * @returns A promise that resolves when the update is complete.
   */
  async updateSubTaskStatus(task: TaskInterface) {
    if (task.id) {
      try {
        let docRef = this.getSingleDocRef(task.id);
        await updateDoc(docRef, this.getCleanJson(task));
      } catch (err) {
        console.error(err);
      }
    }
  }

  /**
   * Deletes a subtask from a task in Firestore.
   * @param task The task object from which the subtask will be deleted.
   * @param subTaskIndex The index of the subtask to delete.
   * @returns A promise that resolves when the subtask is deleted.
   */
  async deleteSubTask(task: TaskInterface, subTaskIndex: number) {
    if (task.id && Array.isArray(task.subTasks)) {
      try {
        task.subTasks.splice(subTaskIndex, 1);
        const docRef = this.getSingleDocRef(task.id);
        await updateDoc(docRef, {
          subTasks: task.subTasks,
        });
      } catch (err) {}
    }
  }

  /**
   * Returns a task object for Firestore update without the ID.
   * @param task The task to convert to a clean JSON format.
   * @returns A clean JSON object with task data.
   */
  getCleanJson(task: TaskInterface) {
    return {
      title: task.title,
      description: task.description,
      category: task.category,
      dueDate: task.dueDate,
      priority: task.priority,
      subTasks: task.subTasks,
      taskType: task.taskType,
      assignedTo: task.assignedTo,
      images: task.images,
    };
  }

  /**
   * Finds the index of a task in the `tasks` array by its ID.
   * @param id The ID of the task to find.
   * @returns The index of the task or -1 if not found.
   */
  findIndexById(id: string): number {
    return this.tasks.findIndex((task) => task.id === id);
  }
}
