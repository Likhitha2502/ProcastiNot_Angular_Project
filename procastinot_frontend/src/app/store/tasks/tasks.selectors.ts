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
export const selectFetchByIdLoading = createSelector(selectTaskState, (s) => s.loading.fetchById);
export const selectFetchedTask = createSelector(selectTaskState, (s) => s.fetchedTask);
export const selectTasksError = createSelector(selectTaskState, (s) => s.error);
export const selectTaskFilters = createSelector(selectTaskState, (s) => s.filters);
export const selectTaskSort = createSelector(selectTaskState, (s) => s.sort);
export const selectTaskStatus = createSelector(selectTaskState, (s) => s.status);
export const selectTaskCount = createSelector(selectTaskState, (s) => s.tasks.length);

export const selectVisibleTasks = createSelector(selectTaskState, (s) => {
  const { status, priority, dueDateFrom, dueDateTo, titleSearch } = s.filters;
  const hasDueDateRange = !!dueDateFrom || !!dueDateTo;
  const hasActiveFilters = status.length > 0 || priority.length > 0 || hasDueDateRange || !!titleSearch;

  let result = [...s.tasks];

  // A task is visible if it matches ANY active filter group (status, priority,
  // due date range, title) — not all of them. From/To within the due date
  // range are combined as one range check, not treated as separate criteria.
  if (hasActiveFilters) {
    const query = titleSearch?.toLowerCase() ?? '';
    result = result.filter((t) => {
      const matchesStatus = status.length > 0 && status.includes(t.status);
      const matchesPriority = priority.length > 0 && priority.includes(t.priority);
      const matchesDueDateRange =
        hasDueDateRange && (!dueDateFrom || t.dueDate >= dueDateFrom) && (!dueDateTo || t.dueDate <= dueDateTo);
      const matchesTitle = !!titleSearch && t.title.toLowerCase().includes(query);
      return matchesStatus || matchesPriority || matchesDueDateRange || matchesTitle;
    });
  }

  result.sort((a, b) => {
    let cmp = 0;
    if (s.sort.field === 'priority') {
      cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    } else if (s.sort.field === 'title') {
      cmp = a.title.localeCompare(b.title);
    } else if (s.sort.field === 'description') {
      cmp = (a.description ?? '').localeCompare(b.description ?? '');
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
    s.filters.dueDateTo !== null ||
    !!s.filters.titleSearch
);
