import { Injectable } from '@angular/core';

/**
 * Service for providing dummy contact data.
 * 
 * This service contains a predefined list of dummy contacts that can be used for testing
 * or populating a contact list in the application. Each contact includes a name, email address,
 * and phone number.
 */
@Injectable({
  providedIn: 'root'
})
export class DummyContactsService {

  constructor() { }

  dummyContacts: { name: string, mail: string, phone: string }[] = [
    {
      name: "Aaron Dorsten",
      mail: "aaron.do@web.com",
      phone: "+49 160 1234567"
    },
    {
      name: "Janet Sichel",
      mail: "janet.sichel@web.com",
      phone: "+49 151 9876543"
    },
    {
      name: "Benno Hahmann",
      mail: "hahmann.benno@web.com",
      phone: "+49 157 4567890"
    },
    {
      name: "Emilia Kartel",
      mail: "emilia.kartel@welt.de",
      phone: "+49 7521 654987"
    },
    {
      name: "Leonie Löwenhaupt",
      mail: "leonie.loewenhaupt@web.abc",
      phone: "+49 164 5849760"
    },
    {
      name: "Sophia Müller",
      mail: "sophia.mueller@example.com",
      phone: "+49 170 7418529"
    },
    {
      name: "Liam O'Brien",
      mail: "liam.obrien@example.com",
      phone: "+353 85 3692581"
    },
    {
      name: "Isabella Rossi",
      mail: "isabella.rossi@example.com",
      phone: "+39 349 2581473"
    },
    {
      name: "David Kim",
      mail: "david.kim@example.com",
      phone: "+49 152 1472583"
    },
    {
      name: "Nora Schmidt",
      mail: "nora.schmidt@example.com",
      phone: "+49 176 8529637"
    }
  ];
  
}
