import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ProfilePictureDialogData {
  currentImage: string | null;
  initials: string;
}

export type ProfilePictureDialogResult = File | null | undefined;

@Component({
  selector: 'app-profile-picture-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './profile-picture-dialog.component.html',
  styleUrl: './profile-picture-dialog.component.scss',
})
export class ProfilePictureDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ProfilePictureDialogComponent, ProfilePictureDialogResult>);
  readonly data = inject<ProfilePictureDialogData>(MAT_DIALOG_DATA);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  tempFile: File | null = null;
  tempPreview: string | null = null;
  isDeletedInModal = false;

  get previewSrc(): string | null {
    if (this.isDeletedInModal) return null;
    return this.tempPreview || this.data.currentImage;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (this.tempPreview) URL.revokeObjectURL(this.tempPreview);
    this.tempFile = file;
    this.tempPreview = URL.createObjectURL(file);
    this.isDeletedInModal = false;
  }

  markDeleted(): void {
    this.tempFile = null;
    this.isDeletedInModal = true;
  }

  handleSet(): void {
    if (this.isDeletedInModal) {
      this.dialogRef.close(null);
    } else if (this.tempFile) {
      this.dialogRef.close(this.tempFile);
    } else {
      this.dialogRef.close(undefined);
    }
  }

  handleCancel(): void {
    this.dialogRef.close(undefined);
  }
}
