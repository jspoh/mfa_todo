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
          if (val.loggedIn) {
            userService.userData.userId$.next(val.data.userId);
            userService.userData.username$.next(val.data.username);
            userService.userData.name$.next(val.data.name);
            console.log(`Logged in as ${val.data.username}`);
          } else {
            console.log('Guest user');
          }

        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
