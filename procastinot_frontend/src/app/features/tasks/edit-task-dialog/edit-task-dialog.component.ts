import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { PRIORITIES, STATUSES } from '@app/core/models';
import type { Task, TasksPriority, TaskStatus } from '@app/core/models';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import { selectFetchByIdLoading, selectFetchedTask, selectTasksError, selectTasksLoading } from '@app/store/tasks/tasks.selectors';

import { parseIsoDate, toIsoDate } from '../tasks.utils';

export interface EditTaskDialogData {
  taskId: number;
}

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.scss',
})
export class EditTaskDialogComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly dialogRef = inject(MatDialogRef<EditTaskDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly data = inject<EditTaskDialogData>(MAT_DIALOG_DATA);

  readonly statuses = STATUSES;
  readonly priorities = PRIORITIES;

  readonly loading$ = this.store.select(selectTasksLoading);
  readonly error$ = this.store.select(selectTasksError);
  readonly fetchedTask$ = this.store.select(selectFetchedTask);
  readonly fetchLoading$ = this.store.select(selectFetchByIdLoading);

  private fetchedTask: Task | null = null;

  readonly form = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(255)]),
    description: this.fb.nonNullable.control('', [Validators.maxLength(255)]),
    status: this.fb.nonNullable.control<TaskStatus>(STATUSES[0], Validators.required),
    priority: this.fb.nonNullable.control<TasksPriority>('MEDIUM', Validators.required),
    dueDate: this.fb.control<Date | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.store.dispatch(TasksActions.fetchTaskByIdRequest({ id: this.data.taskId }));

    this.fetchedTask$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((task) => {
      if (!task) return;
      this.fetchedTask = task;
      this.form.reset({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        dueDate: parseIsoDate(task.dueDate),
      });
      this.store.dispatch(TasksActions.clearTasksErrors());
    });

    // Listen for the *action*, not persisted store state — the store's `status`
    // flag stays 'updated' after a successful save, so a state-based subscription
    // fires immediately (with the stale value) the next time this dialog opens,
    // closing it before it's ever visible.
    this.actions$
      .pipe(ofType(TasksActions.updateTaskSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.dialogRef.close());
  }

  ngOnDestroy(): void {
    this.store.dispatch(TasksActions.clearFetchedTask());
  }

  onFieldChange(): void {
    this.store.dispatch(TasksActions.clearTasksErrors());
  }

  get isDirty(): boolean {
    if (!this.fetchedTask) return false;
    const draft = this.form.getRawValue();
    return (
      draft.title !== this.fetchedTask.title ||
      draft.description !== (this.fetchedTask.description ?? '') ||
      draft.status !== this.fetchedTask.status ||
      draft.priority !== this.fetchedTask.priority ||
      toIsoDate(draft.dueDate) !== this.fetchedTask.dueDate
    );
  }

  handleSave(): void {
    if (!this.fetchedTask || !this.isDirty || this.form.invalid) return;
    const { title, description, status, priority, dueDate } = this.form.getRawValue();
    this.store.dispatch(
      TasksActions.updateTaskRequest({
        payload: {
          id: this.fetchedTask.id,
          data: {
            title: title.trim(),
            description: description.trim() || null,
            status,
            priority,
            dueDate: toIsoDate(dueDate),
          },
        },
      })
    );
  }

  handleClose(): void {
    this.dialogRef.close();
  }
}
