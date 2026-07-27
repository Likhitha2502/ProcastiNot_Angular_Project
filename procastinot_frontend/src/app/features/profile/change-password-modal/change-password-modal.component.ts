import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { PasswordInputComponent } from '@app/shared/password-input/password-input.component';
import { AuthActions } from '@app/store/auth/auth.actions';
import { selectAuthError, selectPasswordChanged } from '@app/store/auth/auth.selectors';

export interface ChangePasswordDialogData {
  forced?: boolean;
}

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, MatDialogModule, MatButtonModule, PasswordInputComponent],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<ChangePasswordModalComponent>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly data = inject<ChangePasswordDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly forced = this.data?.forced ?? false;
  readonly error$ = this.store.select(selectAuthError);

  readonly form = this.fb.nonNullable.group({
    currentPassword: [''],
    newPassword: [''],
    confirmPassword: [''],
  });

  validationError: string | null = null;

  ngOnInit(): void {
    this.store
      .select(selectPasswordChanged)
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.handleClose());
  }

  onFieldChange(): void {
    this.validationError = null;
    this.store.dispatch(AuthActions.clearError());
  }

  get isSaveEnabled(): boolean {
    const { currentPassword, newPassword, confirmPassword } = this.form.getRawValue();
    return (
      currentPassword.length > 0 &&
      newPassword.length >= 8 &&
      newPassword !== currentPassword &&
      newPassword === confirmPassword
    );
  }

  handleSave(): void {
    const { currentPassword, newPassword, confirmPassword } = this.form.getRawValue();

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.validationError = 'All fields are required.';
      return;
    }
    if (newPassword.length < 8) {
      this.validationError = 'New password must be at least 8 characters.';
      return;
    }
    if (newPassword !== confirmPassword) {
      this.validationError = 'New passwords do not match.';
      return;
    }
    if (currentPassword === newPassword) {
      this.validationError = 'New password must differ from current password.';
      return;
    }

    this.store.dispatch(AuthActions.changePasswordRequest({ payload: { currentPassword, newPassword } }));
  }

  handleClose(): void {
    this.form.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    this.validationError = null;
    this.store.dispatch(AuthActions.clearError());
    this.store.dispatch(AuthActions.clearPasswordStatus());
    this.dialogRef.close();
  }
}
