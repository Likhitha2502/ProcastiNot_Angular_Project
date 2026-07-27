import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';

import { PRIORITIES, STATUSES } from '@app/core/models';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import { selectTasksError, selectTasksLoading } from '@app/store/tasks/tasks.selectors';

@Component({
  selector: 'app-add-task-modal',
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

  readonly form = this.fb.nonNullable.group({
    title: [''],
    status: STATUSES[0],
    priority: 'MEDIUM' as (typeof PRIORITIES)[number],
    dueDate: [''],
  });

  onFieldChange(): void {
    this.store.dispatch(TasksActions.clearTasksErrors());
  }

  handleSave(): void {
    const values = this.form.getRawValue();
    if (!values.title.trim()) return;
    this.store.dispatch(TasksActions.createTaskRequest({ payload: values }));
    this.dialogRef.close();
  }

  handleClose(): void {
    this.dialogRef.close();
  }
}
