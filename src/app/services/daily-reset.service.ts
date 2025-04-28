import { Injectable, inject } from '@angular/core';
import { DummyContactsService } from './dummy-contacts.service';
import { DummyTasksService } from './dummy-tasks.service';
import { TasksService } from './tasks.service';
import { ContactsService } from './contacts.service';
import { Firestore, doc, getDoc, setDoc, DocumentReference} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DailyResetService {
  dummyContacts = inject(DummyContactsService);
  dummyTasks = inject(DummyTasksService);
  taskService = inject(TasksService);
  contactsService = inject(ContactsService);
  firestore: Firestore = inject(Firestore);
  
  constructor() { }

  getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  async updateDayStamp(docRef: DocumentReference, date: string) {
  await setDoc(docRef, { currentDay: date });
  }

  runReset() {
    this.deleteAllContacts();
    this.deleteAllTasks();
    this.createDummyContacts();
    setTimeout(() => {
      this.createDummyTasks();
    }, 200);
  }

  async checkAndResetIfNeeded() {
    const currentDate = this.getTodayDateString();
    const docRef = doc(this.firestore, 'timeStamp', 'currentDayStamp');
  
    try {
      const stampSnap = await getDoc(docRef);
      const storedDate = stampSnap.exists() ? stampSnap.data()['currentDay'] : null;
  
      if (storedDate !== currentDate) {
        await this.runReset();
        await this.updateDayStamp(docRef, currentDate);
      } else {}
    } catch (err) {
      console.error('Error reading current timestamp:', err);
    }
  }
  
  createDummyTasks() {
    this.setDummyAssignees();
    this.dummyTasks.dummyTasks.forEach((task) => {
      this.taskService.addTask(task);
    });
    console.log("logadfaeg");
    
    console.log(this.dummyTasks.dummyTasks);
  }

  setDummyAssignees() {
    this.dummyTasks.dummyTasks.forEach((task) => {
      task.assignedTo.forEach((element)=> {
        const index = Number(element.contactId);
        element.contactId = this.contactsService.contacts[index].id;
      })
    });
  }

  createDummyContacts() {
    this.dummyContacts.dummyContacts.forEach((contact) => {
      this.contactsService.addContact(contact);
    });
  }

  deleteAllContacts() {
    this.contactsService.contacts.forEach((contact) => {
      if (contact.id) {
        this.contactsService.deleteContact(contact.id).then(() => {
        });
      }
    });
  }

  deleteAllTasks() {
    this.taskService.tasks.forEach((task) => {
      if (task.id) {
        this.taskService.deleteTask(task.id).then(() => {
        });
      }
    });
  }

}

