import { Injectable, inject } from '@angular/core';
import { ContactsService } from './contacts.service';
import { TaskInterface } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class DummyTasksService {
  contactsService = inject(ContactsService);
  today: string = new Date().toISOString().split('T')[0];

  dummyTasks: TaskInterface[] = [
    {
      title: 'Login-Komponente erstellen',
      description: 'Implementiere eine Login-Komponente mit Validierung.',
      category: 'Technical Task',
      dueDate: new Date(this.today),
      priority: 'critical',
      subTasks: ['HTML Struktur', 'Form Validation', 'Routing einbauen'],
      taskType: 'toDo',
      assignedTo: [
        { contactId: this.contactsService.contacts[0].id },
        { contactId: this.contactsService.contacts[2].id }
      ]
    },
    {
      title: 'Nutzerregistrierung testen',
      description: 'Registrierungsflow auf allen Devices prüfen.',
      category: 'User Story',
      dueDate: new Date(this.today),
      priority: 'medium',
      subTasks: ['Mobil testen', 'Tablet testen', 'Desktop testen'],
      taskType: 'inProgress',
      assignedTo: [
        { contactId: this.contactsService.contacts[0].id },
        { contactId: this.contactsService.contacts[1].id },
        { contactId: this.contactsService.contacts[3].id }
      ]
    },
    {
      title: 'Dark Mode Design Review',
      description: 'Feedback von UX-Team einholen.',
      category: 'User Story',
      dueDate: new Date(this.today),
      priority: 'trivial',
      subTasks: ['Farbpalette analysieren', 'Accessibility prüfen'],
      taskType: 'feedback',
      assignedTo: [
        { contactId: this.contactsService.contacts[4].id }
      ]
    },
    {
      title: 'Build-Optimierung abgeschlossen',
      description: 'Projektgröße reduziert und Buildzeit halbiert.',
      category: 'Technical Task',
      dueDate: new Date(this.today),
      priority: 'critical',
      subTasks: ['Webpack analysiert', 'Chunks reduziert', 'Assets optimiert'],
      taskType: 'done',
      assignedTo: [
        { contactId: this.contactsService.contacts[3].id }
      ]
    },
    {
      title: 'Profilseite umsetzen',
      description: 'User sollen ihre Daten und ein Avatarbild bearbeiten können.',
      category: 'User Story',
      dueDate: new Date(this.today),
      priority: 'medium',
      subTasks: ['Formular bauen', 'Image Upload', 'Live-Vorschau'],
      taskType: 'toDo',
      assignedTo: [
        { contactId: this.contactsService.contacts[5].id },
        { contactId: this.contactsService.contacts[7].id }
      ]
    },
    {
      title: 'Code Refactoring: Services',
      description: 'Dienste modularisieren und vereinheitlichen.',
      category: 'Technical Task',
      dueDate: new Date(this.today),
      priority: 'critical',
      subTasks: ['AuthService', 'UserService', 'NotificationService'],
      taskType: 'inProgress',
      assignedTo: [
        { contactId: this.contactsService.contacts[6].id }
      ]
    }
  ];
  
}
