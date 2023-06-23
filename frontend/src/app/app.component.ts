import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { take } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  constructor(dataService: DataService, userService: UserService) {
    dataService
      .getUser()
      .pipe(take(1))
      .subscribe({
        next: (val) => {
          // console.log(val);
          userService.userData.userId.next(val.userId);
          userService.userData.username.next(val.username);
          userService.userData.name.next(val.name);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
