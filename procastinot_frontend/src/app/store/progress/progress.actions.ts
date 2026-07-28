import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { TaskCountData, TaskPercentData } from '@app/core/models';

export const ProgressActions = createActionGroup({
  source: 'Progress',
  events: {
    'Fetch Count Request': emptyProps(),
    'Fetch Count Success': props<{ count: TaskCountData }>(),
    'Fetch Count Failure': props<{ error: string }>(),

    'Fetch Percent Request': emptyProps(),
    'Fetch Percent Success': props<{ percent: TaskPercentData }>(),
    'Fetch Percent Failure': props<{ error: string }>(),
  },
});
