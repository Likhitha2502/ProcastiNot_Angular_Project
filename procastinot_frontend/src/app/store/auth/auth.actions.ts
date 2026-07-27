import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ChangePassword, LoginPayload, LoginResponse, RegisterPayload } from '@app/core/models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Register Request': props<{ payload: RegisterPayload }>(),
    'Register Success': emptyProps(),
    'Register Failure': props<{ error: string }>(),

    'Login Request': props<{ payload: LoginPayload }>(),
    'Login Success': props<{ response: LoginResponse }>(),
    'Login Failure': props<{ error: string }>(),

    'Forgot Password Request': props<{ email: string }>(),
    'Forgot Password Success': emptyProps(),
    'Forgot Password Failure': props<{ error: string }>(),

    'Change Password Request': props<{ payload: ChangePassword }>(),
    'Change Password Success': emptyProps(),
    'Change Password Failure': props<{ error: string }>(),

    'Logout Request': emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: string }>(),

    'Set Change Password Flag': props<{ flag: boolean }>(),
    'Clear Password Status': emptyProps(),
    'Clear Error': emptyProps(),
  },
});
