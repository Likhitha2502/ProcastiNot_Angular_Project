import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { ROUTES } from '@app/core/constants/routes.const';
import { AuthActions } from '@app/store/auth/auth.actions';
import { selectIsLoginSuccess, selectRegistrationSuccess } from '@app/store/auth/auth.selectors';

import { ForgotPasswordFormComponent } from '../forgot-password-form/forgot-password-form.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { SignupFormComponent } from '../signup-form/signup-form.component';

type View = 'login' | 'signup' | 'forgot';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent, SignupFormComponent, ForgotPasswordFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly view = signal<View>('login');

  ngOnInit(): void {
    this.store
      .select(selectRegistrationSuccess)
      .pipe(
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.store.dispatch(AuthActions.clearError());
        this.view.set('login');
      });

    this.store
      .select(selectIsLoginSuccess)
      .pipe(
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.router.navigate([ROUTES.tasks]);
      });
  }

  get headerText(): string {
    if (this.view() === 'login') return 'Sign in';
    if (this.view() === 'signup') return 'Create Account';
    return 'Reset Password';
  }

  showSignUp(): void {
    this.store.dispatch(AuthActions.clearError());
    this.view.set('signup');
  }

  showForgot(): void {
    this.store.dispatch(AuthActions.clearError());
    this.view.set('forgot');
  }

  showLogin(): void {
    this.store.dispatch(AuthActions.clearError());
    this.view.set('login');
  }
}
