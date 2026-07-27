import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { TasksPriority } from '@app/core/models';

import type { TaskState } from './tasks.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

const PRIORITY_ORDER: Record<TasksPriority, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export const selectTasksLoading = createSelector(selectTaskState, (s) => s.loading);
export const selectTasksError = createSelector(selectTaskState, (s) => s.error);
export const selectTaskFilters = createSelector(selectTaskState, (s) => s.filters);
export const selectTaskSort = createSelector(selectTaskState, (s) => s.sort);
export const selectTaskStatus = createSelector(selectTaskState, (s) => s.status);
export const selectTaskCount = createSelector(selectTaskState, (s) => s.tasks.length);

export const selectVisibleTasks = createSelector(selectTaskState, (s) => {
  let result = [...s.tasks];

  if (s.filters.status.length) result = result.filter((t) => s.filters.status.includes(t.status));
  if (s.filters.priority.length) result = result.filter((t) => s.filters.priority.includes(t.priority));
  if (s.filters.dueDateFrom) result = result.filter((t) => t.dueDate >= s.filters.dueDateFrom!);
  if (s.filters.dueDateTo) result = result.filter((t) => t.dueDate <= s.filters.dueDateTo!);

  result.sort((a, b) => {
    let cmp = 0;
    if (s.sort.field === 'priority') {
      cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    } else if (s.sort.field === 'title') {
      cmp = a.title.localeCompare(b.title);
    } else if (s.sort.field === 'status') {
      cmp = a.status.localeCompare(b.status);
    } else {
      cmp = a.dueDate.localeCompare(b.dueDate);
    }
    return s.sort.direction === 'asc' ? cmp : -cmp;
  });

  return result;
});

export const selectHasActiveFilters = createSelector(
  selectTaskState,
  (s) =>
    s.filters.status.length > 0 ||
    s.filters.priority.length > 0 ||
    s.filters.dueDateFrom !== null ||
    s.filters.dueDateTo !== null
);
