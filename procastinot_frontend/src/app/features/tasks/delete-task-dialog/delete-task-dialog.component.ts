import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import type { Task } from '@app/core/models';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import { selectTasksLoading } from '@app/store/tasks/tasks.selectors';

export interface DeleteTaskDialogData {
  task: Task;
}

@Component({
  selector: 'app-delete-task-dialog',
  standalone: true,
  imports: [AsyncPipe, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './delete-task-dialog.component.html',
  styleUrl: './delete-task-dialog.component.scss',
})
export class DeleteTaskDialogComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly dialogRef = inject(MatDialogRef<DeleteTaskDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);
  readonly data = inject<DeleteTaskDialogData>(MAT_DIALOG_DATA);

  readonly loading$ = this.store.select(selectTasksLoading);

  ngOnInit(): void {
    // Listen for the *action*, not persisted store state — the store's `status`
    // flag stays 'deleted' after a successful delete, so a state-based subscription
    // fires immediately (with the stale value) the next time this dialog opens,
    // closing it before it's ever visible.
    this.actions$
      .pipe(ofType(TasksActions.deleteTaskSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.dialogRef.close());
  }

  handleConfirm(): void {
    this.store.dispatch(TasksActions.deleteTaskRequest({ id: this.data.task.id }));
  }

  handleCancel(): void {
    this.dialogRef.close();
  }
}
