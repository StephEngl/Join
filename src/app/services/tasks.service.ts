import { Injectable, inject, OnDestroy } from '@angular/core';
import { TaskInterface } from '../interfaces/task.interface';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, limit, getDoc, setDoc, DocumentReference,} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  firestore: Firestore = inject(Firestore);
  tasks: TaskInterface[] = [];
  unsubscribeTasks;

  constructor() {
    this.unsubscribeTasks = this.subTasksList();
  }

  ngOnDestroy() {
    if (this.unsubscribeTasks) {
      this.unsubscribeTasks();
    }
  }

  subTasksList() {
    const q = query(this.getContactsRef(), orderBy('priority'));
    return onSnapshot(q, (snapshot) => {
        this.tasks = [];
        snapshot.forEach((element) => {
          const contact = element.data();
          console.log(element.data());
          
          this.tasks.push(this.setContactObject(element.id, contact));
        });
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  getContactsRef() {
    return collection(this.firestore, 'tasks');
  }

    setContactObject(id:string, taskData: any): TaskInterface {
      return {
        id: id,
        title: taskData.title || '',
        description: taskData.description || '',
        category: taskData.category || '',
        dueDate: taskData.dueDate?.toDate?.() || new Date(),
        priority: taskData.priority || '',
        subTasks: taskData.subTasks || [],
        assignedTo: taskData.assignedTo || [],
      };
    }

}


