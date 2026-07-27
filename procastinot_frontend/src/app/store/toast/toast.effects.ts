import { inject, Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import type { Action } from '@ngrx/store';
import { filter, map } from 'rxjs';

import { AuthActions } from '../auth/auth.actions';
import { ProfileActions } from '../profile/profile.actions';
import { TasksActions } from '../tasks/tasks.actions';

import { ToastActions } from './toast.actions';
import type { ToastSeverity } from './toast.actions';

interface ToastConfig {
  message: string | null;
  severity: ToastSeverity;
}

// Cross-cutting: maps any dispatched action's type to a toast, mirroring the
// React app's toastEpic TOAST_MAP (there any-action listener isn't a standard
// NgRx idiom — enumerating action types here is the closest equivalent).
@Injectable()
export class ToastEffects {
  private actions$ = inject(Actions);

  private readonly toastMap: Record<string, ToastConfig> = {
    [AuthActions.loginSuccess.type]: { message: 'Logged in successfully', severity: 'success' },
    [AuthActions.loginFailure.type]: { message: null, severity: 'error' },
    [AuthActions.registerSuccess.type]: { message: 'Account created successfully', severity: 'success' },
    [AuthActions.registerFailure.type]: { message: null, severity: 'error' },
    [AuthActions.forgotPasswordSuccess.type]: { message: 'Password reset email sent', severity: 'success' },
    [AuthActions.forgotPasswordFailure.type]: { message: null, severity: 'error' },
    [AuthActions.changePasswordSuccess.type]: { message: 'Password changed successfully', severity: 'success' },
    [AuthActions.changePasswordFailure.type]: { message: null, severity: 'error' },
    [AuthActions.logoutSuccess.type]: { message: 'Logged out successfully', severity: 'success' },
    [AuthActions.logoutFailure.type]: { message: null, severity: 'error' },

    [TasksActions.createTaskSuccess.type]: { message: 'Task created', severity: 'success' },
    [TasksActions.createTaskFailure.type]: { message: null, severity: 'error' },
    [TasksActions.updateTaskSuccess.type]: { message: 'Task updated', severity: 'success' },
    [TasksActions.updateTaskFailure.type]: { message: null, severity: 'error' },
    [TasksActions.deleteTaskSuccess.type]: { message: 'Task deleted', severity: 'success' },
    [TasksActions.deleteTaskFailure.type]: { message: null, severity: 'error' },
    [TasksActions.fetchTasksFailure.type]: { message: null, severity: 'error' },

    [ProfileActions.updateUserProfileSuccess.type]: { message: 'Profile updated successfully', severity: 'success' },
    [ProfileActions.updateUserProfileFailure.type]: { message: null, severity: 'error' },
  };

  showToast$ = createEffect(() =>
    this.actions$.pipe(
      filter((action: Action) => action.type in this.toastMap),
      map((action) => {
        const config = this.toastMap[action.type];
        const payloadMessage = (action as unknown as { error?: string }).error;
        const message = config.message ?? payloadMessage ?? 'Something went wrong.';
        return ToastActions.showToast({ message, severity: config.severity });
      })
    )
  );
}
