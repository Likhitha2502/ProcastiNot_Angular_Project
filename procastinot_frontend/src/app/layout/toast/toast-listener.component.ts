import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { combineLatest, filter } from 'rxjs';

import { ToastActions } from '@app/store/toast/toast.actions';
import { selectToastMessage, selectToastOpen, selectToastSeverity } from '@app/store/toast/toast.selectors';

@Component({
  selector: 'app-toast-listener',
  standalone: true,
  template: '',
})
export class ToastListenerComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectToastOpen),
      this.store.select(selectToastMessage),
      this.store.select(selectToastSeverity),
    ])
      .pipe(
        filter(([open]) => open),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([, message, severity]) => {
        const ref = this.snackBar.open(message, 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [`toast-${severity}`],
        });

        ref.afterDismissed().subscribe(() => this.store.dispatch(ToastActions.hideToast()));
      });
  }
}
