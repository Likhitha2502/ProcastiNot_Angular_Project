import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RequestStatus } from '@app/core/models';

import type { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsRegisterLoading = createSelector(selectAuthState, (s) => s.register);
export const selectIsAuthorized = createSelector(selectAuthState, (s) => s.isAuthorized);
export const selectRegistrationSuccess = createSelector(
  selectAuthState,
  (s) => s.statuses.register === RequestStatus.Success
);
export const selectIsLoginSuccess = createSelector(
  selectAuthState,
  (s) => s.statuses.login === RequestStatus.Success
);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);
export const selectLoggedInUser = createSelector(selectAuthState, (s) => s.loggedInUser);
export const selectAuthLoaders = createSelector(selectAuthState, (s) => s.loading);
export const selectPasswordChanged = createSelector(
  selectAuthState,
  (s) => s.statuses.passwordChangeStatus === RequestStatus.Success
);
export const selectMustChangePassword = createSelector(selectAuthState, (s) => s.mustChangePassword);
export const selectIsLogoutLoading = createSelector(selectAuthState, (s) => s.loading.logout);
export const selectIsLoggedOut = createSelector(
  selectAuthState,
  (s) => s.statuses.logout === RequestStatus.Success && !s.isAuthorized
);
