import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/pages/task-list/task-list';
import { TaskFormComponent } from './features/tasks/pages/task-form/task-form';
import { LoginComponent } from './features/auth/login/login';
import { AuthGuard } from './core/guards/auth'; // ✅ import guard

export const routes: Routes = [
  { path: '', component: TaskListComponent, canActivate: [AuthGuard] },      // ✅ protected
  { path: 'add', component: TaskFormComponent, canActivate: [AuthGuard] },   // ✅ protected
  { path: 'edit/:id', component: TaskFormComponent, canActivate: [AuthGuard] }, // ✅ protected
  { path: 'login', component: LoginComponent },  // public
  { path: '**', redirectTo: '' }                 // ✅ catch-all
];
