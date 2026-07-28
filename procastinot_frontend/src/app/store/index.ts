import type { ActionReducerMap } from '@ngrx/store';

import { authReducer } from './auth/auth.reducer';
import type { AuthState } from './auth/auth.reducer';
import { profileReducer } from './profile/profile.reducer';
import type { ProfileState } from './profile/profile.reducer';
import { progressReducer } from './progress/progress.reducer';
import type { ProgressState } from './progress/progress.reducer';
import { tasksReducer } from './tasks/tasks.reducer';
import type { TaskState } from './tasks/tasks.reducer';
import { toastReducer } from './toast/toast.reducer';
import type { ToastState } from './toast/toast.reducer';

export interface RootState {
  auth: AuthState;
  profile: ProfileState;
  progress: ProgressState;
  tasks: TaskState;
  toast: ToastState;
}

export const reducers: ActionReducerMap<RootState> = {
  auth: authReducer,
  profile: profileReducer,
  progress: progressReducer,
  tasks: tasksReducer,
  toast: toastReducer,
};
