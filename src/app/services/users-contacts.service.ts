import { Injectable } from '@angular/core';
import { ContactInterface } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersContactsService {
  defaultColors: string[] = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#e4b300',
    '#0038FF',
    '#6ed81c',
    '#b7a202',
    '#FF4646',
    '#FFBB2B',
  ];
  constructor() { }

  setObjectData(id:string, obj: any): ContactInterface {
    return {
      id: id,
      name: obj.name || '',
      phone: obj.phone || '',
      mail: obj.mail || '',
      color: obj.color || this.getRandomColor(),
    };
  }

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.defaultColors.length);
    return this.defaultColors[randomIndex];
  }

  getCleanJson(object: ContactInterface) {
    return {
      name: object.name,
      phone: object.phone,
      mail: object.mail,
      color: object.color || this.getRandomColor(),
    };
  }
}
