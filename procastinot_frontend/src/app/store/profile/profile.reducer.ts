import { createReducer, on } from '@ngrx/store';

import type { User } from '@app/core/models';

import { ProfileActions } from './profile.actions';

export interface ProfileState {
  userProfile: User | null;
  imageIcon: string | null;
  error: string | null;
  loading: {
    fetch: boolean;
    image: boolean;
    update: boolean;
  };
  status: 'updated' | null;
}

export const initialProfileState: ProfileState = {
  userProfile: null,
  imageIcon: null,
  error: null,
  loading: { fetch: false, image: false, update: false },
  status: null,
};

export const profileReducer = createReducer(
  initialProfileState,

  on(ProfileActions.fetchUserProfileRequest, (state) => ({
    ...state,
    loading: { ...state.loading, fetch: true },
    error: null,
  })),
  on(ProfileActions.fetchUserProfileSuccess, (state, { user }) => ({
    ...state,
    loading: { ...state.loading, fetch: false },
    userProfile: user,
    error: null,
  })),
  on(ProfileActions.fetchUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, fetch: false },
    error,
  })),

  on(ProfileActions.fetchUserProfilePictureRequest, (state) => ({
    ...state,
    loading: { ...state.loading, image: true },
    error: null,
  })),
  on(ProfileActions.fetchUserProfilePictureSuccess, (state, { imageIcon }) => ({
    ...state,
    loading: { ...state.loading, image: false },
    imageIcon,
    error: null,
  })),
  on(ProfileActions.fetchUserProfilePictureFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, image: false },
    error,
  })),

  on(ProfileActions.updateUserProfileRequest, (state) => ({
    ...state,
    loading: { ...state.loading, update: true },
    status: null,
    error: null,
  })),
  on(ProfileActions.updateUserProfileSuccess, (state, { user }) => ({
    ...state,
    userProfile: user,
    loading: { ...state.loading, update: false },
    status: 'updated' as const,
    error: null,
  })),
  on(ProfileActions.updateUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, update: false },
    error,
  })),

  on(ProfileActions.clearProfileError, (state) => ({ ...state, error: null }))
);
