import {
  OnDestroy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
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
export class TodosComponent implements OnInit, OnDestroy {
  @ViewChildren('todoItems') todoItems?: QueryList<ElementRef>;

  viewingUser = '';
  viewingPermissions = false; // light frontend security. need to implement server side too => frontend easy to hack

  todos: Todo[] = [];

  todoForm: any;

  $unsubscribe = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    initTE({ Input, Ripple });

    this.viewingUser = this.router.url.replace('/', '');
    this.viewingPermissions =
      this.userService.userData.username$.getValue() == this.viewingUser &&
      this.viewingUser != '';

    // check if user in userService is updated (some browsers might be slow and show 404 page and never recover afterwards)
    this.userService.userData.username$
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((username) => {
        this.viewingPermissions = username == this.viewingUser && this.viewingUser != '';
      });

    this.initTodoForm();
    this.updateTodos();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private initTodoForm() {
    this.todoForm = this.fb.group({
      // postId: [{ value: null, disabled: false }, []],
      // userId: [
      //   {
      //     value: this.userService.userData.userId$.getValue(),
      //     disabled: false,
      //   },
      //   [],
      // ],
      dateUpdated: [{ value: null, disabled: false }, []],
      content: [{ value: '', disabled: false }, [Validators.required]],
      // done: [{ value: false, disabled: false }, []],
    });
  }

  private updateTodos() {
    this.dataService
      .getTodos()
      .pipe(take(1))
      .subscribe({
        next: (val) => {
          this.todos = val.reverse();
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
          this.initTodoForm();
        },
        error: () => {},
      });
  }

  onEditTodoContent(i: number) {
    const el: ElementRef = this.todoItems!.get(i)!;
    const contentEl: HTMLElement =
      el.nativeElement.children[0].children[0].children[0];
    contentEl.contentEditable = 'true';
    contentEl.classList.add('border-2', 'border-black');
    contentEl.focus();

    // add done checkmark
    // const newSpan = document.createElement('span');
    // newSpan.innerHTML = '<i (click)="onEditTodo(i)" class="fa-solid fa-right-to-bracket"></i>';
    // contentEl.appendChild(newSpan);

    this.todos[i].editing = true;
  }

  onEditTodo(i: number, invertDoneStatus: boolean = false) {
    this.todos[i].editing = false;
    const el: ElementRef = this.todoItems!.get(i)!;
    const contentEl: HTMLElement =
      el.nativeElement.children[0].children[0].children[0];
    contentEl.contentEditable = 'false';
    contentEl.classList.remove('border-2', 'border-black');

    const payload = this.todos[i];
    payload.content = contentEl.innerText;
    if (invertDoneStatus) {
      payload.done = !payload.done;
    } else {
      payload.dateUpdated = Date.now();
    }
    delete payload.editing;
    this.dataService
      .updateTodo(payload)
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
    this.onEditTodo(i, true);
  }

  public msToDate(dt: number): Date {
    return new Date(dt);
  }
}
