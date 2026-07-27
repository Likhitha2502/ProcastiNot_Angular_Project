import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';

import { API } from '@app/core/constants/api-routes.const';
import { ROUTES } from '@app/core/constants/routes.const';
import { JwtService } from '@app/core/services/jwt.service';
import { TempAuthService } from '@app/core/services/temp-auth.service';
import { apiUrl } from '@app/core/utils/api-url.util';
import { getResponseError } from '@app/core/utils/response.util';
import type { ChangePasswordResponse, LoginResponse } from '@app/core/models';

import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private jwtService = inject(JwtService);
  private tempAuthService = inject(TempAuthService);
  private router = inject(Router);

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerRequest),
      switchMap(({ payload }) =>
        this.http.post(apiUrl(API.auth.register), payload).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError((error: HttpErrorResponse) =>
            of(
              AuthActions.registerFailure({
                error: getResponseError(error) || 'Registration failed. Please try again.',
              })
            )
          )
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      switchMap(({ payload }) =>
        this.http.post<LoginResponse>(apiUrl(API.auth.login), payload).pipe(
          mergeMap((response) => {
            this.jwtService.setToken(response.token);
            return of(
              AuthActions.loginSuccess({ response }),
              AuthActions.setChangePasswordFlag({ flag: response.requiresPasswordReset })
            );
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              AuthActions.loginFailure({
                error: getResponseError(error) || 'Login failed. Please check your credentials.',
              })
            )
          )
        )
      )
    )
  );

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPasswordRequest),
      switchMap(({ email }) =>
        this.http.post(apiUrl(API.auth.forgotPassword), { email }).pipe(
          map(() => {
            this.tempAuthService.setTempPasswordFlag();
            return AuthActions.forgotPasswordSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              AuthActions.forgotPasswordFailure({
                error: getResponseError(error) || 'Password reset failed. Please try again.',
              })
            )
          )
        )
      )
    )
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePasswordRequest),
      switchMap(({ payload }) =>
        this.http.put<ChangePasswordResponse>(apiUrl(API.profile.changePassword), payload).pipe(
          mergeMap((response) => {
            this.tempAuthService.clearTempPasswordFlag();
            if (response.forceLogout) {
              return of(AuthActions.changePasswordSuccess(), AuthActions.logoutRequest());
            }
            return of(AuthActions.changePasswordSuccess());
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              AuthActions.changePasswordFailure({
                error: getResponseError(error) || 'Failed to change password.',
              })
            )
          )
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutRequest),
      switchMap(() =>
        this.http.post(apiUrl(API.auth.logout), {}).pipe(
          map(() => {
            this.jwtService.removeToken();
            this.tempAuthService.clearTempPasswordFlag();
            return AuthActions.logoutSuccess();
          }),
          catchError((error: HttpErrorResponse) => {
            this.jwtService.removeToken();
            this.tempAuthService.clearTempPasswordFlag();
            return of(AuthActions.logoutFailure({ error: getResponseError(error) || 'Logout failed.' }));
          })
        )
      )
    )
  );

  // Navigate to login whenever logout completes — covers both manual logout
  // and a forced logout from the 401 error interceptor.
  navigateOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate([ROUTES.auth.login]))
      ),
    { dispatch: false }
  );
}
