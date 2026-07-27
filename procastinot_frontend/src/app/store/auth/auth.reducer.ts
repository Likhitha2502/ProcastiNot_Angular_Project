import { createReducer, on } from '@ngrx/store';

import { RequestStatus } from '@app/core/models';
import type { LoginResponse } from '@app/core/models';

import { AuthActions } from './auth.actions';

export interface AuthState {
  loggedInUser: LoginResponse | null;
  isAuthorized: boolean | null;
  register: boolean;
  mustChangePassword: boolean;
  loading: {
    forgotPassword: boolean;
    changePassword: boolean;
    logout: boolean;
  };
  accessToken: string | null;
  error: string | null;
  statuses: {
    register: RequestStatus;
    login: RequestStatus;
    logout: RequestStatus;
    passwordChangeStatus: RequestStatus;
  };
}

export const initialAuthState: AuthState = {
  loggedInUser: null,
  isAuthorized: false,
  register: false,
  mustChangePassword: false,
  loading: { forgotPassword: false, changePassword: false, logout: false },
  accessToken: null,
  error: null,
  statuses: {
    register: RequestStatus.Idle,
    login: RequestStatus.Idle,
    logout: RequestStatus.Idle,
    passwordChangeStatus: RequestStatus.Idle,
  },
};

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.registerRequest, (state) => ({
    ...state,
    register: true,
    statuses: { ...state.statuses, register: RequestStatus.Idle },
    error: null,
  })),
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    register: false,
    statuses: { ...state.statuses, register: RequestStatus.Success },
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    register: false,
    error,
    statuses: { ...state.statuses, register: RequestStatus.Failure },
  })),

  on(AuthActions.loginRequest, (state) => ({
    ...state,
    isAuthorized: null,
    error: null,
    statuses: { ...state.statuses, login: RequestStatus.Pending, logout: RequestStatus.Idle },
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    loggedInUser: response,
    isAuthorized: true,
    accessToken: response.token,
    statuses: { ...state.statuses, login: RequestStatus.Success, logout: RequestStatus.Idle },
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    statuses: { ...state.statuses, login: RequestStatus.Failure },
  })),

  on(AuthActions.forgotPasswordRequest, (state) => ({
    ...state,
    loading: { ...state.loading, forgotPassword: true },
    error: null,
  })),
  on(AuthActions.forgotPasswordSuccess, (state) => ({
    ...state,
    loading: { ...state.loading, forgotPassword: false },
    error: null,
  })),
  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, forgotPassword: false },
    error,
  })),

  on(AuthActions.changePasswordRequest, (state) => ({
    ...state,
    error: null,
    loading: { ...state.loading, changePassword: true },
    statuses: { ...state.statuses, passwordChangeStatus: RequestStatus.Idle },
  })),
  on(AuthActions.changePasswordSuccess, (state) => ({
    ...state,
    loading: { ...state.loading, changePassword: false },
    statuses: { ...state.statuses, passwordChangeStatus: RequestStatus.Success },
    mustChangePassword: false,
    error: null,
  })),
  on(AuthActions.changePasswordFailure, (state, { error }) => ({
    ...state,
    error,
    loading: { ...state.loading, changePassword: false },
    statuses: { ...state.statuses, passwordChangeStatus: RequestStatus.Failure },
  })),

  on(AuthActions.logoutRequest, (state) => ({
    ...state,
    loading: { ...state.loading, logout: true },
    error: null,
    statuses: { ...state.statuses, logout: RequestStatus.Pending },
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    loggedInUser: null,
    isAuthorized: false,
    accessToken: null,
    mustChangePassword: false,
    error: null,
    loading: { ...state.loading, logout: false },
    statuses: {
      ...state.statuses,
      login: RequestStatus.Idle,
      logout: RequestStatus.Success,
      passwordChangeStatus: RequestStatus.Idle,
    },
  })),
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loggedInUser: null,
    isAuthorized: false,
    accessToken: null,
    loading: { ...state.loading, logout: false },
    statuses: { ...state.statuses, login: RequestStatus.Idle, logout: RequestStatus.Failure },
    error,
  })),

  on(AuthActions.setChangePasswordFlag, (state, { flag }) => ({
    ...state,
    mustChangePassword: flag,
  })),
  on(AuthActions.clearPasswordStatus, (state) => ({
    ...state,
    mustChangePassword: false,
    statuses: { ...state.statuses, passwordChangeStatus: RequestStatus.Idle },
  })),
  on(AuthActions.clearError, (state) => ({ ...state, error: null })),
);
