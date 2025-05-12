import { Injectable, inject } from '@angular/core';
import { DummyContactsService } from './dummy-contacts.service';
import { DummyTasksService } from './dummy-tasks.service';
import { TasksService } from './tasks.service';
import { ContactsService } from './contacts.service';
import { Firestore, doc, getDoc, setDoc, DocumentReference} from '@angular/fire/firestore';

/**
 * Service responsible for resetting the data on a daily basis by checking the current date.
 * It deletes existing contacts and tasks, and populates them with dummy data if the stored timestamp is outdated.
 * 
 * This service interacts with Firestore to store and check the current day timestamp, 
 * ensuring that the reset only happens once per day.
 */
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

  /**
   * Returns the current date as a string in the format 'YYYY-MM-DD'.
   * 
   * @returns {string} The current date.
   */
  getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Updates the current day timestamp in Firestore.
   * 
   * @param {DocumentReference} docRef The document reference for the timestamp document.
   * @param {string} date The date to update the timestamp with.
   */
  async updateDayStamp(docRef: DocumentReference, date: string) {
  await setDoc(docRef, { currentDay: date });
  }

  /**
   * Runs the daily reset by deleting all contacts and tasks, and recreating them with dummy data.
   * 
   * It calls methods to delete all contacts and tasks and creates new dummy contacts and tasks
   * after a short delay to ensure data consistency.
   */
  runReset() {
    this.deleteAllContacts();
    this.deleteAllTasks();
    this.createDummyContacts();
    setTimeout(() => {
      this.createDummyTasks();
    }, 200);
  }

  /**
   * Checks the stored timestamp in Firestore to determine if a reset is needed.
   * If the stored timestamp does not match the current date, it runs the reset process and updates the timestamp.
   */
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
  
  /**
   * Creates dummy tasks by setting assigned users and adding tasks to the task service.
   */
  createDummyTasks() {
    this.setDummyAssignees();
    this.dummyTasks.dummyTasks.forEach((task) => {
      this.taskService.addTask(task);
    });
  }

  /**
   * Sets the assigned users for the dummy tasks based on the contact data.
   * Updates the contactId to the actual ID from the contacts service.
   */
  setDummyAssignees() {
    this.dummyTasks.dummyTasks.forEach((task) => {
      task.assignedTo.forEach((element)=> {
        const index = Number(element.contactId);
        element.contactId = this.contactsService.contacts[index].id;
      })
    });
  }

  /**
   * Creates dummy contacts by adding them to the contacts service.
   */
  createDummyContacts() {
    this.dummyContacts.dummyContacts.forEach((contact) => {
      this.contactsService.addContact(contact);
    });
  }

  /**
   * Deletes all contacts from the contacts service.
   * This operation will attempt to delete each contact by its ID.
   */
  deleteAllContacts() {
    this.contactsService.contacts.forEach((contact) => {
      if (contact.id) {
        this.contactsService.deleteContact(contact.id).then(() => {
        });
      }
    });
  }

  /**
   * Deletes all tasks from the task service.
   * This operation will attempt to delete each task by its ID.
   */
  deleteAllTasks() {
    this.taskService.tasks.forEach((task) => {
      if (task.id) {
        this.taskService.deleteTask(task.id).then(() => {
        });
      }
    });
  }
}
