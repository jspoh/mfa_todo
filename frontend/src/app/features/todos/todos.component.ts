import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  viewingUser = '';
  viewingPermissions = false;  // light frontend security. need to implement server side too => frontend easy to hack
  
  todos = [];

  constructor(private userService: UserService, router: Router, dataService: DataService) { 
    this.viewingUser = router.url.replace('/', '');
    this.viewingPermissions = (userService.userData.username$.getValue() == this.viewingUser);
  }

  ngOnInit(): void {
    
  }

}
