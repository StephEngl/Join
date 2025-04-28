import { Injectable, inject } from '@angular/core';
import { ContactsService } from './contacts.service';
import { TaskInterface } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class DummyTasksService {
  today: string = new Date().toISOString().split('T')[0];

  dummyTasks: TaskInterface[] = [
    {
      title: 'Login-Komponente erstellen',
      description: 'Implementiere eine Login-Komponente mit Validierung.',
      category: 'Technical Task',
      dueDate: new Date(this.today),
      priority: 'urgent',
      subTasks: [
        { text: 'HTML Struktur', isChecked: true },
        { text: 'Form Validation', isChecked: false },
        { text: 'Routing einbauen', isChecked: false }
      ],
      taskType: 'toDo',
      assignedTo: [
        { contactId: "0" },
        { contactId: "3" },
        { contactId: "5" },
        { contactId: "7" }
      ]
    },
    {
      title: 'Nutzerregistrierung testen',
      description: 'Registrierungsflow auf allen Devices prüfen.',
      category: 'User Story',
      dueDate: new Date(this.today),
      priority: 'medium',
      subTasks: [
        { text: 'Mobil testen', isChecked: false },
        { text: 'Tablet testen', isChecked: false },
        { text: 'Desktop testen', isChecked: false }
      ],
      taskType: 'inProgress',
      assignedTo: [
        { contactId: "2" },
        { contactId: "5" },
        { contactId: "8" }
      ]
    },
    {
      title: 'Dark Mode Design Review',
      description: 'Feedback von UX-Team einholen.',
      category: 'User Story',
      dueDate: new Date(this.today),
      priority: 'low',
      subTasks: [
        { text: 'Farbpalette analysieren', isChecked: false },
        { text: 'Accessibility prüfen', isChecked: false }
      ],
      taskType: 'feedback',
      assignedTo: [
        { contactId: "2" },
        { contactId: "4" }
      ]
    },
    {
      title: 'Build-Optimierung abgeschlossen',
      description: 'Projektgröße reduziert und Buildzeit halbiert.',
      category: 'Technical Task',
      dueDate: new Date(this.today),
      priority: 'urgent',
      subTasks: [
        { text: 'Webpack analysiert', isChecked: false },
        { text: 'Chunks reduziert', isChecked: false },
        { text: 'Assets optimiert', isChecked: false }
      ],
      taskType: 'done',
      assignedTo: [
        { contactId: "0" },
        { contactId: "1" },
        { contactId: "3" },
        { contactId: "4" }
      ]
    },
    {
      title: 'Profilseite umsetzen',
      description: 'User sollen ihre Daten und ein Avatarbild bearbeiten können.',
      category: 'User Story',
      dueDate: new Date(this.today),
      priority: 'medium',
      subTasks: [
        { text: 'Formular bauen', isChecked: false },
        { text: 'Image Upload', isChecked: false },
        { text: 'Live-Vorschau', isChecked: false }
      ],
      taskType: 'toDo',
      assignedTo: [
        { contactId: "1" },
        { contactId: "7" },
        { contactId: "9" }
      ]
    },
    {
      title: 'Code Refactoring: Services',
      description: 'Dienste modularisieren und vereinheitlichen.',
      category: 'Technical Task',
      dueDate: new Date(this.today),
      priority: 'urgent',
      subTasks: [
        { text: 'AuthService', isChecked: false },
        { text: 'UserService', isChecked: false },
        { text: 'NotificationService', isChecked: false }
      ],
      taskType: 'inProgress',
      assignedTo: [
        { contactId: "2" },
        { contactId: "4" },
        { contactId: "6" },
        { contactId: "9" }
      ]
    }
  ];
  
  
  


}
