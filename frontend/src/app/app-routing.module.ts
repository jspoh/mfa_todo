import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserIsNotLoggedIn } from './guards/user-is-not-logged-in';
import { UserIsLoggedInGuard } from './guards/user-is-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
    canActivate: [UserIsNotLoggedIn]
  },
  { path: 'login', redirectTo: '' },
  { path: 'signup', loadChildren: () => import('./features/signup/signup.module').then(m => m.SignupModule) },
  { path: '**', loadChildren: () => import('./features/todos/todos.module').then(m => m.TodosModule), canActivate: [UserIsLoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
