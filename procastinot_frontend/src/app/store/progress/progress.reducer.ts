import { createReducer, on } from '@ngrx/store';

import type { TaskCountData, TaskPercentData } from '@app/core/models';

import { ProgressActions } from './progress.actions';

export interface ProgressState {
  count: TaskCountData | null;
  percent: TaskPercentData | null;
  loading: {
    count: boolean;
    percent: boolean;
  };
  error: string | null;
}

export const initialProgressState: ProgressState = {
  count: null,
  percent: null,
  loading: { count: false, percent: false },
  error: null,
};

export const progressReducer = createReducer(
  initialProgressState,

  on(ProgressActions.fetchCountRequest, (state) => ({
    ...state,
    loading: { ...state.loading, count: true },
    error: null,
  })),
  on(ProgressActions.fetchCountSuccess, (state, { count }) => ({
    ...state,
    loading: { ...state.loading, count: false },
    count,
  })),
  on(ProgressActions.fetchCountFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, count: false },
    error,
  })),

  on(ProgressActions.fetchPercentRequest, (state) => ({
    ...state,
    loading: { ...state.loading, percent: true },
    error: null,
  })),
  on(ProgressActions.fetchPercentSuccess, (state, { percent }) => ({
    ...state,
    loading: { ...state.loading, percent: false },
    percent,
  })),
  on(ProgressActions.fetchPercentFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, percent: false },
    error,
  }))
);
