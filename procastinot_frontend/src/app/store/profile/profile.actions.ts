import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ProfilePayload, User } from '@app/core/models';

export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Fetch User Profile Request': emptyProps(),
    'Fetch User Profile Success': props<{ user: User }>(),
    'Fetch User Profile Failure': props<{ error: string }>(),

    'Fetch User Profile Picture Request': emptyProps(),
    'Fetch User Profile Picture Success': props<{ imageIcon: string | null }>(),
    'Fetch User Profile Picture Failure': props<{ error: string }>(),

    'Update User Profile Request': props<{ values: ProfilePayload }>(),
    'Update User Profile Success': props<{ user: User }>(),
    'Update User Profile Failure': props<{ error: string }>(),

    'Clear Profile Error': emptyProps(),
  },
});
