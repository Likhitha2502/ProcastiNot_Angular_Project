import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';

import { PasswordInputComponent } from '@app/shared/password-input/password-input.component';
import { AuthActions } from '@app/store/auth/auth.actions';
import { selectAuthError, selectIsRegisterLoading } from '@app/store/auth/auth.selectors';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PasswordInputComponent,
  ],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent {
  @Output() backToLogin = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly error$ = this.store.select(selectAuthError);
  readonly loading$ = this.store.select(selectIsRegisterLoading);

  readonly form = this.fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    password: [''],
  });

  onFieldChange(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  onRegister(): void {
    const { firstName, lastName, email, password } = this.form.getRawValue();
    this.store.dispatch(AuthActions.registerRequest({ payload: { firstName, lastName, email, password } }));
  }
}
