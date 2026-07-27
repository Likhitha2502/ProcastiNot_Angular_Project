import type { ActionReducerMap } from '@ngrx/store';

import { authReducer } from './auth/auth.reducer';
import type { AuthState } from './auth/auth.reducer';
import { profileReducer } from './profile/profile.reducer';
import type { ProfileState } from './profile/profile.reducer';
import { tasksReducer } from './tasks/tasks.reducer';
import type { TaskState } from './tasks/tasks.reducer';
import { toastReducer } from './toast/toast.reducer';
import type { ToastState } from './toast/toast.reducer';

export interface RootState {
  auth: AuthState;
  profile: ProfileState;
  tasks: TaskState;
  toast: ToastState;
}

export const reducers: ActionReducerMap<RootState> = {
  auth: authReducer,
  profile: profileReducer,
  tasks: tasksReducer,
  toast: toastReducer,
};
