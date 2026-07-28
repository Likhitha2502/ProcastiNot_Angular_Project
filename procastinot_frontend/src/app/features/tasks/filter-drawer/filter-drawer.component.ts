import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { PRIORITIES, PRIORITY_COLORS, STATUS_COLORS, STATUSES } from '@app/core/models';
import type { TaskFilters, TasksPriority, TaskStatus } from '@app/core/models';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import { selectHasActiveFilters, selectTaskFilters } from '@app/store/tasks/tasks.selectors';

import { parseIsoDate, toIsoDate } from '../tasks.utils';

const EMPTY_FILTERS: TaskFilters = {
  status: [],
  priority: [],
  dueDateFrom: null,
  dueDateTo: null,
  titleSearch: null,
};

const arraysEqual = (a: string[], b: string[]): boolean => a.length === b.length && a.every((v) => b.includes(v));

@Component({
  selector: 'app-filter-drawer',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './filter-drawer.component.html',
  styleUrl: './filter-drawer.component.scss',
})
export class FilterDrawerComponent {
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<FilterDrawerComponent>);

  readonly statuses = STATUSES;
  readonly priorities = PRIORITIES;
  readonly statusColors = STATUS_COLORS;
  readonly priorityColors = PRIORITY_COLORS;

  appliedFilters: TaskFilters = EMPTY_FILTERS;
  hasActiveFilters = false;
  draft: TaskFilters = EMPTY_FILTERS;

  constructor() {
    this.store
      .select(selectTaskFilters)
      .pipe(take(1))
      .subscribe((filters) => {
        this.appliedFilters = filters;
        this.draft = { ...filters };
      });
    this.store
      .select(selectHasActiveFilters)
      .pipe(take(1))
      .subscribe((v) => (this.hasActiveFilters = v));
  }

  get titleSearchValid(): boolean {
    return !this.draft.titleSearch || this.draft.titleSearch.length >= 3;
  }

  get draftIsDirty(): boolean {
    return (
      !arraysEqual(this.draft.status, this.appliedFilters.status) ||
      !arraysEqual(this.draft.priority, this.appliedFilters.priority) ||
      this.draft.dueDateFrom !== this.appliedFilters.dueDateFrom ||
      this.draft.dueDateTo !== this.appliedFilters.dueDateTo ||
      this.draft.titleSearch !== this.appliedFilters.titleSearch
    );
  }

  toggleStatus(status: TaskStatus): void {
    this.draft = {
      ...this.draft,
      status: this.draft.status.includes(status)
        ? this.draft.status.filter((s) => s !== status)
        : [...this.draft.status, status],
    };
  }

  togglePriority(priority: TasksPriority): void {
    this.draft = {
      ...this.draft,
      priority: this.draft.priority.includes(priority)
        ? this.draft.priority.filter((p) => p !== priority)
        : [...this.draft.priority, priority],
    };
  }

  get dueDateFromValue(): Date | null {
    return parseIsoDate(this.draft.dueDateFrom);
  }

  get dueDateToValue(): Date | null {
    return parseIsoDate(this.draft.dueDateTo);
  }

  setDueDateFrom(date: Date | null): void {
    this.draft = { ...this.draft, dueDateFrom: date ? toIsoDate(date) : null };
  }

  setDueDateTo(date: Date | null): void {
    this.draft = { ...this.draft, dueDateTo: date ? toIsoDate(date) : null };
  }

  setTitleSearch(value: string): void {
    this.draft = { ...this.draft, titleSearch: value || null };
  }

  handleApply(): void {
    if (!this.draftIsDirty || !this.titleSearchValid) return;
    this.store.dispatch(TasksActions.setFilters({ filters: this.draft }));
    this.dialogRef.close();
  }

  handleReset(): void {
    this.store.dispatch(TasksActions.clearFilters());
    this.draft = { ...EMPTY_FILTERS };
    this.appliedFilters = { ...EMPTY_FILTERS };
    this.hasActiveFilters = false;
  }

  handleClose(): void {
    this.dialogRef.close();
  }
}
