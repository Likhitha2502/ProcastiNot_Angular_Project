import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';

import { JwtService } from '@app/core/services/jwt.service';
import { AuthActions } from '@app/store/auth/auth.actions';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          jwtService.removeToken();
          store.dispatch(AuthActions.logoutSuccess());
          break;

        case 400:
        case 409:
          // pass through — handled by the calling effect's catchError
          break;

        case 500:
          console.error('[HTTP] Server error — check your Spring Boot logs');
          break;
      }

      return throwError(() => error);
    })
  );
};
