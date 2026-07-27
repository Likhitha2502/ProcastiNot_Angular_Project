import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { ProfileState } from './profile.reducer';

export const selectProfileState = createFeatureSelector<ProfileState>('profile');

export const selectUserProfile = createSelector(selectProfileState, (s) => s.userProfile);
export const selectUserIcon = createSelector(selectProfileState, (s) => s.imageIcon);
export const selectProfileStatus = createSelector(selectProfileState, (s) => s.status);
export const selectProfileLoaders = createSelector(selectProfileState, (s) => s.loading);
export const selectProfileError = createSelector(selectProfileState, (s) => s.error);
