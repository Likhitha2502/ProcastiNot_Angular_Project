import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { JwtService } from '@app/core/services/jwt.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const token = jwtService.getToken();

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
