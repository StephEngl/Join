import { TaskImageData } from './task-image-data';

export type UndoImageAction = UndoImageActionSingle | UndoImageActionAll;

export interface UndoImageActionSingle {
  type: 'single';
  image: TaskImageData;
  index: number;
}

export interface UndoImageActionAll {
  type: 'all';
  images: TaskImageData[];
}
