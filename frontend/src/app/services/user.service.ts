import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData = {
    userId: new BehaviorSubject<number | null>(null),
    username: new BehaviorSubject<string>(''),  // errr actually i think a string will do, no need behavioursubject
    name: new BehaviorSubject<string>('')
  };

  constructor() { }
}
