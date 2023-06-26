import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
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
  // dateUpdatedDateObj?: Date;
  done: boolean;
  editing?: boolean;
}

export interface CreateTodoPayload {
  userId: number;
  dateUpdated: number;
  content: string;
}

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  @ViewChildren('todoItems') todoItems?: QueryList<ElementRef>;

  viewingUser = '';
  viewingPermissions = false; // light frontend security. need to implement server side too => frontend easy to hack

  todos: Todo[] = [];

  todoForm: any;

  constructor(
    private userService: UserService,
    router: Router,
    private dataService: DataService,
    fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.viewingUser = router.url.replace('/', '');
    this.viewingPermissions =
      userService.userData.username$.getValue() == this.viewingUser &&
      this.viewingUser != '';

    this.todoForm = fb.group({
      // postId: [{ value: null, disabled: false }, []],
      userId: [
        {
          value: this.userService.userData.userId$.getValue(),
          disabled: false,
        },
        [],
      ],
      dateUpdated: [{ value: null, disabled: false }, []],
      content: [{ value: '', disabled: false }, [Validators.required]],
      // done: [{ value: false, disabled: false }, []],
    });
  }

  ngOnInit(): void {
    initTE({ Input, Ripple });

    this.updateTodos();
  }

  private updateTodos() {
    this.dataService
      .getTodos()
      .pipe(take(1))
      .subscribe({
        next: (val) => {
          this.todos = val;
          // this.cdRef.detectChanges();
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

    const payload: CreateTodoPayload = this.todoForm.value;
    payload.dateUpdated = Date.now();

    this.dataService
      .createTodo(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.updateTodos();
          this.todoForm.reset();
        },
        error: () => {},
      });
  }

  onEditTodoContent(i: number) {
    const el: ElementRef = this.todoItems!.get(i)!;
    const contentEl: HTMLElement = el.nativeElement.children[0].children[0];
    contentEl.contentEditable = 'true';
    contentEl.classList.add('border-2', 'border-black');

    // add done checkmark
    // const newSpan = document.createElement('span');
    // newSpan.innerHTML = '<i (click)="onEditTodo(i)" class="fa-solid fa-right-to-bracket"></i>';
    // contentEl.appendChild(newSpan);
    
    this.todos[i].editing = true;
  }

  onEditTodo(i: number) {}

  onDeleteTodo(i: number) {
    this.dataService
      .deleteTodo(i)
      .pipe(take(1))
      .subscribe({
        next: (val) => {
          this.updateTodos();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onMarkAsDone(i: number) {
    if (!this.todoForm.done) {
      this.todoForm.done = true;
    } else {
      this.todoForm.done = !this.todoForm.done;
    }

    this.onEditTodo(i);
  }

  public msToDate(dt: number): Date {
    return new Date(dt);
  }
}
