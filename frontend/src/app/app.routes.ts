import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/pages/task-list/task-list';
import { TaskFormComponent } from './features/tasks/pages/task-form/task-form';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AuthGuard } from './core/guards/auth';

export const routes: Routes = [
  { path: '', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {path: 'register',   component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
