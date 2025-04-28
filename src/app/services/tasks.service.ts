import { Injectable, inject, OnDestroy } from '@angular/core';
import { TaskInterface } from '../interfaces/task.interface';
import {
    Firestore,
    collection,
    doc,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    DocumentReference
} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class TasksService implements OnDestroy {
    firestore: Firestore = inject(Firestore);
    tasks: TaskInterface[] = [];
    unsubscribeTasks: () => void;

    constructor() {
        /* Automatically subscribe to tasks on service instantiation */
        this.unsubscribeTasks = this.subTasksList();
    }

    /* Unsubscribe from Firestore when service is destroyed */
    ngOnDestroy() {
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
                    //console.log(task); // do not delete, toggled to check Data
                    this.tasks.push(this.setTaskObject(element.id, task));
                });
            },
            (error) => {
                console.error('Firestore Error', error.message);
            }
        );
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
     * @param id - Task document ID.
     * @param taskData - Firestore document data.
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
            assignedTo: taskData.assignedTo || []
        };
    }

    /**
     * Adds a new task to Firestore.
     * @param task - The task object to add.
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
     * @param docId - ID of the task to delete.
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
     * @param task - The updated task object.
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
     * Returns a task object without ID to use for Firestore updates.
     * @param task - TaskInterface object.
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
            assignedTo: task.assignedTo
        };
    }
}
