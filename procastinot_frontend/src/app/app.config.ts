import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { authInterceptor } from '@app/core/interceptors/auth.interceptor';
import { errorInterceptor } from '@app/core/interceptors/error.interceptor';
import { AuthEffects } from '@app/store/auth/auth.effects';
import { ProfileEffects } from '@app/store/profile/profile.effects';
import { TasksEffects } from '@app/store/tasks/tasks.effects';
import { ToastEffects } from '@app/store/toast/toast.effects';
import { reducers } from '@app/store/index';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideStore(reducers),
    provideEffects([AuthEffects, ProfileEffects, TasksEffects, ToastEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
  ],
};
