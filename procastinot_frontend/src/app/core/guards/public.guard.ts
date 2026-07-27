import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';

import { ROUTES } from '@app/core/constants/routes.const';
import { selectIsLoginSuccess } from '@app/store/auth/auth.selectors';

export const publicGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsLoginSuccess).pipe(
    take(1),
    map((isLoginSuccess) => (isLoginSuccess ? router.createUrlTree([ROUTES.tasks]) : true))
  );
};
