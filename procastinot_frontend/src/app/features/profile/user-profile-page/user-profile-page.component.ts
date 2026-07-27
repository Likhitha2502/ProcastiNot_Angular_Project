import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, take } from 'rxjs';

import { PendingFileService } from '@app/core/services/pending-file.service';
import { ProfileActions } from '@app/store/profile/profile.actions';
import { selectUserIcon, selectUserProfile } from '@app/store/profile/profile.selectors';

import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { ProfilePictureDialogComponent } from '../profile-picture-dialog/profile-picture-dialog.component';
import type { ProfilePictureDialogResult } from '../profile-picture-dialog/profile-picture-dialog.component';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss',
})
export class UserProfilePageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly pendingFileService = inject(PendingFileService);

  private readonly userProfile$ = this.store.select(selectUserProfile);
  private readonly profileIcon$ = this.store.select(selectUserIcon);

  readonly vm$ = combineLatest([this.userProfile$, this.profileIcon$]).pipe(
    map(([user, profileIcon]) => ({ user, profileIcon }))
  );

  readonly form = this.fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
  });

  pendingFile: File | null | undefined = undefined;
  pendingUrl: string | null = null;
  saving = false;

  private hasInitialized = false;

  ngOnInit(): void {
    this.store.dispatch(ProfileActions.fetchUserProfilePictureRequest());
    this.store.dispatch(ProfileActions.fetchUserProfileRequest());

    this.userProfile$.pipe(filter((user) => !!user && !this.hasInitialized)).subscribe((user) => {
      this.form.patchValue({ firstName: user!.firstName ?? '', lastName: user!.lastName ?? '' });
      this.hasInitialized = true;
    });
  }

  initials(firstName?: string, lastName?: string): string {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}` || 'U';
  }

  avatarSrc(profileIcon: string | null): string | null {
    if (this.pendingFile === null) return null;
    return this.pendingUrl || profileIcon || null;
  }

  openPictureDialog(profileIcon: string | null): void {
    this.userProfile$.pipe(take(1)).subscribe((user) => {
      const dialogRef = this.dialog.open<ProfilePictureDialogComponent, unknown, ProfilePictureDialogResult>(
        ProfilePictureDialogComponent,
        {
          width: '400px',
          data: {
            currentImage: this.avatarSrc(profileIcon),
            initials: this.initials(user?.firstName, user?.lastName),
          },
        }
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result === undefined) return;
        this.pendingFile = result;
        if (this.pendingUrl) URL.revokeObjectURL(this.pendingUrl);
        this.pendingUrl = result instanceof File ? URL.createObjectURL(result) : null;
      });
    });
  }

  openChangePassword(): void {
    this.dialog.open(ChangePasswordModalComponent, { width: '420px' });
  }

  handleSave(): void {
    this.saving = true;
    this.pendingFileService.set(this.pendingFile);
    const { firstName, lastName } = this.form.getRawValue();
    this.store.dispatch(ProfileActions.updateUserProfileRequest({ values: { firstName, lastName } }));
    setTimeout(() => (this.saving = false), 1000);
  }
}
