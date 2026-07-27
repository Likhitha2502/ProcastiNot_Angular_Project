import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { ToastState } from './toast.reducer';

export const selectToastState = createFeatureSelector<ToastState>('toast');

export const selectToastOpen = createSelector(selectToastState, (s) => s.open);
export const selectToastMessage = createSelector(selectToastState, (s) => s.message);
export const selectToastSeverity = createSelector(selectToastState, (s) => s.severity);
