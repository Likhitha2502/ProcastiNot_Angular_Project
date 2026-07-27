import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, switchMap } from 'rxjs';

import { API } from '@app/core/constants/api-routes.const';
import { PendingFileService } from '@app/core/services/pending-file.service';
import { apiUrl } from '@app/core/utils/api-url.util';
import { getResponseError } from '@app/core/utils/response.util';
import type { User } from '@app/core/models';

import { ProfileActions } from './profile.actions';

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private pendingFileService = inject(PendingFileService);

  fetchUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.fetchUserProfileRequest),
      switchMap(() =>
        this.http.get<User>(apiUrl(API.profile.userInfo)).pipe(
          map((user) => ProfileActions.fetchUserProfileSuccess({ user })),
          catchError((error: HttpErrorResponse) =>
            of(
              ProfileActions.fetchUserProfileFailure({
                error: getResponseError(error) || 'Failed to fetch user profile.',
              })
            )
          )
        )
      )
    )
  );

  fetchUserProfilePicture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.fetchUserProfilePictureRequest),
      switchMap(() =>
        this.http.get(apiUrl(API.profile.userIcon), { responseType: 'blob' }).pipe(
          switchMap((blob) => from(blobToBase64(blob))),
          map((imageIcon) => ProfileActions.fetchUserProfilePictureSuccess({ imageIcon })),
          catchError((error: HttpErrorResponse) =>
            of(
              ProfileActions.fetchUserProfilePictureFailure({
                error: getResponseError(error) || 'Failed to fetch profile picture.',
              })
            )
          )
        )
      )
    )
  );

  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateUserProfileRequest),
      switchMap(({ values }) => {
        const formData = new FormData();
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);

        const file = this.pendingFileService.get();
        if (file instanceof File) {
          formData.append('profilePicture', file, file.name);
        } else if (file === null) {
          formData.append('profilePicture', '');
        }
        this.pendingFileService.clear();

        return this.http.put<User>(apiUrl(API.profile.userInfo), formData).pipe(
          mergeMap((user) =>
            of(ProfileActions.updateUserProfileSuccess({ user }), ProfileActions.fetchUserProfileRequest())
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              ProfileActions.updateUserProfileFailure({
                error: getResponseError(error) || 'Failed to update user profile.',
              })
            )
          )
        );
      })
    )
  );
}
