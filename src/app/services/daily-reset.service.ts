import { Injectable, inject } from '@angular/core';
import { DummyContactsService } from './dummy-contacts.service';
import { DummyTasksService } from './dummy-tasks.service';
import { TasksService } from './tasks.service';
import { ContactsService } from './contacts.service';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  DocumentReference,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DailyResetService {
  dummyContacts = inject(DummyContactsService);
  dummyTasks = inject(DummyTasksService);
  taskService = inject(TasksService);
  contactsService = inject(ContactsService);
  firestore: Firestore = inject(Firestore);

  private isResetting = false;

  constructor() {}

  /**
   * Triggers the daily reset check after a short delay.
   */
  initDailyResetService() {
    setTimeout(() => {
      this.checkAndResetIfNeeded();
    }, 1000);
  }

  /**  Returns the current date as a string in YYYY-MM-DD format. */
  getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Updates the stored daily timestamp in Firestore to the given date.
   * @param docRef - Reference to the Firestore document.
   * @param date - Date string in YYYY-MM-DD format.
   */
  async updateDayStamp(docRef: DocumentReference, date: string) {
    await setDoc(docRef, { currentDay: date });
  }

  /**
   * Runs the reset procedure: deletes all current contacts and tasks,
   * then adds dummy contacts and tasks.
   */
  async runReset() {
    if (this.isResetting) return;
    this.isResetting = true;
    try {
      await this.deleteAllContacts();
      this.contactsService.contacts = [];
      await this.deleteAllTasks();
      setTimeout(() => {
        this.createDummyContacts();
        this.createDummyTasks();
      }, 200);
    } finally {
      this.isResetting = false;
    }
  }

  /**
   * Checks the last saved reset date and runs the reset
   * if the date has changed since the last run.
   */
  async checkAndResetIfNeeded() {
    const currentDate = this.getTodayDateString();
    const docRef = doc(this.firestore, 'timeStamp', 'currentDayStamp');
    try {
      const stampSnap = await getDoc(docRef);
      const storedDate = stampSnap.exists()
        ? stampSnap.data()['currentDay']
        : null;
      if (storedDate !== currentDate) {
        await this.runReset();
        await this.updateDayStamp(docRef, currentDate);
      } else {
      }
    } catch (err) {
      console.error('Error reading current timestamp:', err);
    }
  }

  /** Creates and adds dummy tasks after assigning them to contacts. */
  createDummyTasks() {
    this.setDummyAssignees();
    this.dummyTasks.dummyTasks.forEach((task) => {
      this.taskService.addTask(task);
    });
  }

  /** Updates dummy tasks to use real contact IDs from the contacts service. */
  setDummyAssignees() {
    this.dummyTasks.dummyTasks.forEach((task) => {
      task.assignedTo.forEach((element) => {
        const index = Number(element.contactId);
        element.contactId = this.contactsService.contacts[index].id;
      });
    });
  }

  /** Creates and adds dummy contacts to the contact list. */
  async createDummyContacts() {
    if (this.contactsService.contacts.length === 0) {
      for (const contact of this.dummyContacts.dummyContacts) {
        await this.contactsService.addContact(contact);
      }
    }
  }

  /** Deletes all contacts currently stored in the contacts service. */
  async deleteAllContacts() {
    const deletePromises = this.contactsService.contacts.map((contact) => {
      if (contact.id) {
        return this.contactsService.deleteContact(contact.id);
      }
      return Promise.resolve();
    });
    await Promise.all(deletePromises);
    this.contactsService.contacts = [];
  }

  /**  Deletes all tasks currently stored in the task service. */
  async deleteAllTasks() {
    this.taskService.tasks.forEach((task) => {
      if (task.id) {
        this.taskService.deleteTask(task.id).then(() => {});
      }
    });
  }
}
