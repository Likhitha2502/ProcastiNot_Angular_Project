import { createReducer, on } from '@ngrx/store';

import type { SortDirection, SortField, Task, TaskFilters } from '@app/core/models';

import { TasksActions } from './tasks.actions';

export interface TaskState {
  tasks: Task[];
  loading: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  filters: TaskFilters;
  sort: {
    field: SortField;
    direction: SortDirection;
  };
  status: 'created' | 'updated' | 'deleted' | null;
  error: string | null;
}

export const initialTaskState: TaskState = {
  tasks: [],
  loading: { list: false, create: false, update: false, delete: false },
  status: null,
  error: null,
  filters: {
    status: [],
    priority: [],
    dueDateFrom: null,
    dueDateTo: null,
  },
  sort: {
    field: 'dueDate',
    direction: 'asc',
  },
};

export const tasksReducer = createReducer(
  initialTaskState,

  on(TasksActions.fetchTasksRequest, (state) => ({
    ...state,
    loading: { ...state.loading, list: true },
    error: null,
  })),
  on(TasksActions.fetchTasksSuccess, (state, { tasks }) => ({
    ...state,
    loading: { ...state.loading, list: false },
    tasks,
  })),
  on(TasksActions.fetchTasksFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, list: false },
    error,
  })),

  on(TasksActions.createTaskRequest, (state) => ({
    ...state,
    loading: { ...state.loading, create: true },
    error: null,
    status: null,
  })),
  on(TasksActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    loading: { ...state.loading, create: false },
    status: 'created' as const,
    tasks: [...state.tasks, task],
  })),
  on(TasksActions.createTaskFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, create: false },
    error,
    status: null,
  })),

  on(TasksActions.updateTaskRequest, (state) => ({
    ...state,
    loading: { ...state.loading, update: true },
    error: null,
    status: null,
  })),
  on(TasksActions.updateTaskSuccess, (state) => ({
    ...state,
    loading: { ...state.loading, update: false },
    status: 'updated' as const,
  })),
  on(TasksActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, update: false },
    error,
    status: null,
  })),

  on(TasksActions.deleteTaskRequest, (state) => ({
    ...state,
    loading: { ...state.loading, delete: true },
    error: null,
    status: null,
  })),
  on(TasksActions.deleteTaskSuccess, (state) => ({
    ...state,
    loading: { ...state.loading, delete: false },
    status: 'deleted' as const,
  })),
  on(TasksActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, delete: false },
    error,
    status: null,
  })),

  on(TasksActions.setSort, (state, { field, direction }) => ({
    ...state,
    sort: { field, direction },
  })),
  on(TasksActions.clearTasksErrors, (state) => ({ ...state, error: null })),

  on(TasksActions.setFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),
  on(TasksActions.clearFilters, (state) => ({ ...state, filters: initialTaskState.filters }))
);
