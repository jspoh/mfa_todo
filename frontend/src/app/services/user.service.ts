import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  username = new BehaviorSubject<string>('');  // errr actually i think a string will do, no need behavioursubject

  constructor() { }
}
