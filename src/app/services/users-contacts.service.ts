import { Injectable } from '@angular/core';
import { ContactInterface } from '../interfaces/contact.interface';

/**
 * Service that provides methods to manage contact data.
 * It includes functionality for setting contact data, generating random colors,
 * and cleaning contact data for storage or use in Firestore.
 */
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

  /**
   * Creates a contact object with the provided data and returns it as a `ContactInterface`.
   * If any fields are missing, default values are used.
   * @param id The unique identifier for the contact
   * @param obj The object containing the contact data
   * @returns The created contact object in `ContactInterface` format
   */
  setObjectData(id:string, obj: any): ContactInterface {
    return {
      id: id,
      name: obj.name || '',
      phone: obj.phone || '',
      mail: obj.mail || '',
      color: obj.color || this.getRandomColor(),
    };
  }

  /**
   * Generates a random color by selecting an item from the `defaultColors` array.
   * @returns A randomly selected color in hexadecimal format
   */
  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.defaultColors.length);
    return this.defaultColors[randomIndex];
  }

  /**
   * Returns a cleaned version of the contact object, suitable for storage or use in Firestore.
   * It ensures that all necessary properties are present and that the color is either specified
   * or randomly generated.
   * @param object The contact object to be cleaned
   * @returns A cleaned contact object with the `name`, `phone`, `mail`, and `color` fields
   */
  getCleanJson(object: ContactInterface) {
    return {
      name: object.name,
      phone: object.phone,
      mail: object.mail,
      color: object.color || this.getRandomColor(),
    };
  }
  
}
