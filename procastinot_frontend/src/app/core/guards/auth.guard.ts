import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';

import { ROUTES } from '@app/core/constants/routes.const';
import { JwtService } from '@app/core/services/jwt.service';
import { selectIsLoginSuccess } from '@app/store/auth/auth.selectors';

// Allows access if EITHER Redux/NgRx state shows a successful login OR a JWT
// is present in localStorage — the latter covers a hard page refresh, where
// store state resets to initial but the token still persists.
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const jwtService = inject(JwtService);

  return store.select(selectIsLoginSuccess).pipe(
    take(1),
    map((isLoginSuccess) => {
      const hasAccessToken = !!jwtService.getToken();
      return isLoginSuccess || hasAccessToken ? true : router.createUrlTree([ROUTES.auth.login]);
    })
  );
};
