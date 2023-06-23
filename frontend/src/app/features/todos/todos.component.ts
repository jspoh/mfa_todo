import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { initTE, Input, Ripple } from 'tw-elements';

interface Todo {
  postId: number;
  userId: number;
  content: string; // max 200 char
  dateUpdated: number; // ms
  done: boolean;
}

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  viewingUser = '';
  viewingPermissions = false; // light frontend security. need to implement server side too => frontend easy to hack

  todos: Todo[] = [];

  todoForm: any;

  constructor(
    private userService: UserService,
    router: Router,
    private dataService: DataService,
    fb: FormBuilder
  ) {
    this.viewingUser = router.url.replace('/', '');
    this.viewingPermissions =
      userService.userData.username$.getValue() == this.viewingUser;

    this.todoForm = fb.group({
      // postId: [{ value: null, disabled: false }, []],
      dateUpdated: [{ value: null, disabled: false }, []],
      content: [{ value: '', disabled: false }, [Validators.required]],
      done: [{ value: false, disabled: false }, []],
    });
  }

  ngOnInit(): void {
    initTE({ Input, Ripple });

    this.dataService
      .getTodos()
      .pipe(take(1))
      .subscribe({
        next: (val) => {
          this.todos = val;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onCreateTodo(e: SubmitEvent) {
    e.preventDefault();
    if (this.todoForm.invalid) {
      return;
    }

    const payload = this.todoForm.value;
    payload.dateUpdated = Date.now();

    console.log(payload);
  }
}
