import { Injectable, numberAttribute } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SessionStateService {

    private sessionSource = new BehaviorSubject<any>(null);

    selectedSession$ =
        this.sessionSource.asObservable();

    setSession(session: any) {
        this.sessionSource.next(session);
    }

}