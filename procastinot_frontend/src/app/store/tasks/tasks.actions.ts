import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type {
  CreateTaskPayload,
  SortDirection,
  SortField,
  Task,
  TaskFilters,
  UpdateTaskPayload,
} from '@app/core/models';

export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Fetch Tasks Request': emptyProps(),
    'Fetch Tasks Success': props<{ tasks: Task[] }>(),
    'Fetch Tasks Failure': props<{ error: string }>(),

    'Create Task Request': props<{ payload: CreateTaskPayload }>(),
    'Create Task Success': props<{ task: Task }>(),
    'Create Task Failure': props<{ error: string }>(),

    'Update Task Request': props<{ payload: UpdateTaskPayload }>(),
    'Update Task Success': emptyProps(),
    'Update Task Failure': props<{ error: string }>(),

    'Delete Task Request': props<{ id: Task['id'] }>(),
    'Delete Task Success': emptyProps(),
    'Delete Task Failure': props<{ error: string }>(),

    'Fetch Task By Id Request': props<{ id: Task['id'] }>(),
    'Fetch Task By Id Success': props<{ task: Task }>(),
    'Fetch Task By Id Failure': props<{ error: string }>(),
    'Clear Fetched Task': emptyProps(),

    'Set Sort': props<{ field: SortField; direction: SortDirection }>(),
    'Clear Tasks Errors': emptyProps(),

    'Set Filters': props<{ filters: Partial<TaskFilters> }>(),
    'Clear Filters': emptyProps(),
  },
});
