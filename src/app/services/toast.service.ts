import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
    toastMessage$ = new BehaviorSubject<string>('');
    toastType$ = new BehaviorSubject<'create' | 'update' | 'delete' | 'error'>('create');
    isToastOpen$ = new BehaviorSubject<boolean>(false);
    isToastAnimated$ = new BehaviorSubject<boolean>(false);
    toastIcon$ = new BehaviorSubject<string>('');

    triggerToast(message: string, type: 'create' | 'update' | 'delete' | 'error', iconPath: string = '') {
        this.toastMessage$.next(message);
        this.toastType$.next(type);
        this.toastIcon$.next(iconPath);
        this.isToastOpen$.next(true);
        setTimeout(() => this.isToastAnimated$.next(true), 10);
        setTimeout(() => this.isToastAnimated$.next(false), 2000);
        setTimeout(() => this.isToastOpen$.next(false), 2500);
    }
}
