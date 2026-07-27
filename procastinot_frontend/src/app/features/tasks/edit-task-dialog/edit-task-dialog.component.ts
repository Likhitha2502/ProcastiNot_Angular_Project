import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { PRIORITIES, STATUSES } from '@app/core/models';
import type { Task } from '@app/core/models';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import { selectTaskStatus, selectTasksError, selectTasksLoading } from '@app/store/tasks/tasks.selectors';

export interface EditTaskDialogData {
  task: Task;
}

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.scss',
})
export class EditTaskDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<EditTaskDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly data = inject<EditTaskDialogData>(MAT_DIALOG_DATA);

  readonly statuses = STATUSES;
  readonly priorities = PRIORITIES;
  readonly task = this.data.task;

  readonly loading$ = this.store.select(selectTasksLoading);
  readonly error$ = this.store.select(selectTasksError);

  readonly form = this.fb.nonNullable.group({
    title: [this.task.title],
    status: this.task.status,
    priority: this.task.priority,
    dueDate: [this.task.dueDate],
  });

  ngOnInit(): void {
    this.store.dispatch(TasksActions.clearTasksErrors());

    this.store
      .select(selectTaskStatus)
      .pipe(
        filter((status) => status === 'updated'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.dialogRef.close());
  }

  onFieldChange(): void {
    this.store.dispatch(TasksActions.clearTasksErrors());
  }

  get isDirty(): boolean {
    const draft = this.form.getRawValue();
    return (
      draft.title !== this.task.title ||
      draft.status !== this.task.status ||
      draft.priority !== this.task.priority ||
      draft.dueDate !== this.task.dueDate
    );
  }

  handleSave(): void {
    if (!this.isDirty) return;
    const { title, status, priority, dueDate } = this.form.getRawValue();
    this.store.dispatch(
      TasksActions.updateTaskRequest({ payload: { id: this.task.id, data: { title, status, priority, dueDate } } })
    );
  }

  handleClose(): void {
    this.dialogRef.close();
  }
}
