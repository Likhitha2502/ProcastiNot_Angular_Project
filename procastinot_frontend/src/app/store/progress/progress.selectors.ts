import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { ProgressState } from './progress.reducer';

export const selectProgressState = createFeatureSelector<ProgressState>('progress');

export const selectProgressCount = createSelector(selectProgressState, (s) => s.count);
export const selectProgressPercent = createSelector(selectProgressState, (s) => s.percent);
export const selectProgressLoading = createSelector(selectProgressState, (s) => s.loading);
export const selectProgressError = createSelector(selectProgressState, (s) => s.error);
export const selectProgressTotal = createSelector(selectProgressState, (s) => s.count?.totalTasks ?? 0);
