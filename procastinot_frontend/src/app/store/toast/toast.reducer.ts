import { createReducer, on } from '@ngrx/store';

import { ToastActions } from './toast.actions';
import type { ToastSeverity } from './toast.actions';

export interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

export const initialToastState: ToastState = {
  open: false,
  message: '',
  severity: 'info',
};

export const toastReducer = createReducer(
  initialToastState,
  on(ToastActions.showToast, (state, { message, severity }) => ({ ...state, open: true, message, severity })),
  on(ToastActions.hideToast, (state) => ({ ...state, open: false }))
);
