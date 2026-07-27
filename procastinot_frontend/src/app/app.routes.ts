import { Routes } from '@angular/router';

import { authGuard } from '@app/core/guards/auth.guard';
import { publicGuard } from '@app/core/guards/public.guard';
import { LoginPageComponent } from '@app/features/auth/login-page/login-page.component';
import { TaskProgressComponent } from '@app/features/progress/task-progress.component';
import { UserProfilePageComponent } from '@app/features/profile/user-profile-page/user-profile-page.component';
import { TasksListComponent } from '@app/features/tasks/tasks-list/tasks-list.component';
import { AppLayoutComponent } from '@app/layout/app-layout/app-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'authenticate/login' },

  { path: 'authenticate', canActivate: [publicGuard], component: LoginPageComponent },
  { path: 'authenticate/login', canActivate: [publicGuard], component: LoginPageComponent },
  { path: 'authenticate/signup', canActivate: [publicGuard], component: LoginPageComponent },
  { path: 'authenticate/forgot-password', canActivate: [publicGuard], component: LoginPageComponent },

  {
    path: '',
    canActivate: [authGuard],
    component: AppLayoutComponent,
    children: [
      { path: 'tasks', component: TasksListComponent },
      { path: 'progress', component: TaskProgressComponent },
      { path: 'user-profile', component: UserProfilePageComponent },
    ],
  },

  { path: '**', redirectTo: 'authenticate/login' },
];
