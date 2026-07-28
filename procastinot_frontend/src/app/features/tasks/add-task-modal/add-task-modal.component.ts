import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';

import { PRIORITIES, STATUSES } from '@app/core/models';
import type { CreateTaskPayload, TasksPriority, TaskStatus } from '@app/core/models';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import { selectTasksError, selectTasksLoading } from '@app/store/tasks/tasks.selectors';

import { toIsoDate } from '../tasks.utils';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: STATUSES[0],
  priority: 'MEDIUM' as TasksPriority,
  dueDate: null as Date | null,
};

@Component({
  selector: 'app-add-task-modal',
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
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.scss',
})
export class AddTaskModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<AddTaskModalComponent>);

  readonly statuses = STATUSES;
  readonly priorities = PRIORITIES;

  readonly loading$ = this.store.select(selectTasksLoading);
  readonly error$ = this.store.select(selectTasksError);

  readonly form = this.fb.group({
    title: this.fb.nonNullable.control(EMPTY_FORM.title, [Validators.required, Validators.maxLength(255)]),
    description: this.fb.nonNullable.control(EMPTY_FORM.description, [Validators.maxLength(255)]),
    status: this.fb.nonNullable.control<TaskStatus>(EMPTY_FORM.status, Validators.required),
    priority: this.fb.nonNullable.control<TasksPriority>(EMPTY_FORM.priority, Validators.required),
    dueDate: this.fb.control<Date | null>(EMPTY_FORM.dueDate, Validators.required),
  });

  onFieldChange(): void {
    this.store.dispatch(TasksActions.clearTasksErrors());
  }

  handleSave(): void {
    if (this.form.invalid) return;
    const values = this.form.getRawValue();
    const payload: CreateTaskPayload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      status: values.status,
      priority: values.priority,
      dueDate: toIsoDate(values.dueDate),
    };
    this.store.dispatch(TasksActions.createTaskRequest({ payload }));
    this.handleClose();
  }

  handleClose(): void {
    this.form.reset(EMPTY_FORM);
    this.store.dispatch(TasksActions.clearTasksErrors());
    this.dialogRef.close();
  }
}
