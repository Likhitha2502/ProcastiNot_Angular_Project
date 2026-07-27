import { createActionGroup, emptyProps, props } from '@ngrx/store';

export type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

export const ToastActions = createActionGroup({
  source: 'Toast',
  events: {
    'Show Toast': props<{ message: string; severity: ToastSeverity }>(),
    'Hide Toast': emptyProps(),
  },
});
