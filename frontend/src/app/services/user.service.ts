import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  unsubscribe$ = new Subject<void>();

  isLoggedIn = false;
  userData = {
    userId$: new BehaviorSubject<number | null>(null),
    username$: new BehaviorSubject<string>(''), // errr actually i think a string will do, no need behavioursubject
    name$: new BehaviorSubject<string>(''),
  };

  constructor() {
    this.userData.userId$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isLoggedIn = true;
    });
  }
}
