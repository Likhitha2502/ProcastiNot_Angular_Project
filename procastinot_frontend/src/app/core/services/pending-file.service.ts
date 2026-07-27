import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PendingFileService {
  private pendingFile: File | null | undefined = undefined;

  set(file: File | null | undefined): void {
    this.pendingFile = file;
  }

  get(): File | null | undefined {
    return this.pendingFile;
  }

  clear(): void {
    this.pendingFile = undefined;
  }
}
