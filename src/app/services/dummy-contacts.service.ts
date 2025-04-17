import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DummyContactsService {

  constructor() { }

  dummyContacts: { name: string, mail: string, phone: string }[] = [
    {
      name: "John Doe",
      mail: "john.doe@example.com",
      phone: "+49 160 1234567"
    },
    {
      name: "Jane Smith",
      mail: "jane.smith@example.com",
      phone: "+49 151 9876543"
    },
    {
      name: "Bob Johnson",
      mail: "bob.johnson@example.com",
      phone: "+49 157 4567890"
    },
    {
      name: "Emily Carter",
      mail: "emily.carter@example.com",
      phone: "+44 7521 654987"
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
