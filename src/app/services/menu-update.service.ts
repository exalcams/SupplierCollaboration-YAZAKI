import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FuseNavigation } from '@fuse/types';

@Injectable({
    providedIn: 'root'
})
export class MenuUpdataionService {
    MenuUpdationEvent: Subject<any>;
    constructor() {
        this.MenuUpdationEvent = new Subject();
    }
    GetAndUpdateMenus(): Observable<FuseNavigation[]> {
        return this.MenuUpdationEvent.asObservable();
    }

    PushNewMenus(menus: FuseNavigation[]): void {
        this.MenuUpdationEvent.next(menus);
    }
}
