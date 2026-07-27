import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';

import { AuthActions } from '@app/store/auth/auth.actions';
import { selectAuthError } from '@app/store/auth/auth.selectors';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss',
})
export class ForgotPasswordFormComponent {
  @Output() backToLogin = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly error$ = this.store.select(selectAuthError);

  readonly form = this.fb.nonNullable.group({
    email: [''],
  });

  onFieldChange(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  onSendEmail(): void {
    const { email } = this.form.getRawValue();
    this.store.dispatch(AuthActions.forgotPasswordRequest({ email }));
  }
}
