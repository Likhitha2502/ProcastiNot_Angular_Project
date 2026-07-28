import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';

import { PRIORITY_COLORS, STATUS_COLORS } from '@app/core/models';
import type { SortDirection, SortField, Task, TaskFilters, TasksPriority, TaskStatus } from '@app/core/models';
import { TasksActions } from '@app/store/tasks/tasks.actions';
import {
  selectHasActiveFilters,
  selectTaskCount,
  selectTaskFilters,
  selectTaskSort,
  selectTasksLoading,
  selectVisibleTasks,
} from '@app/store/tasks/tasks.selectors';

import { AddTaskModalComponent } from '../add-task-modal/add-task-modal.component';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import { FilterDrawerComponent } from '../filter-drawer/filter-drawer.component';
import { formatDate, isOverdue } from '../tasks.utils';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly columns: { label: string; field: SortField }[] = [
    { label: 'Task', field: 'title' },
    { label: 'Description', field: 'description' },
    { label: 'Status', field: 'status' },
    { label: 'Priority', field: 'priority' },
    { label: 'Due Date', field: 'dueDate' },
  ];

  readonly tasks$ = this.store.select(selectVisibleTasks);
  readonly loading$ = this.store.select(selectTasksLoading);
  readonly sort$ = this.store.select(selectTaskSort);
  readonly filters$ = this.store.select(selectTaskFilters);
  readonly taskCount$ = this.store.select(selectTaskCount);
  readonly hasActiveFilters$ = this.store.select(selectHasActiveFilters);

  // Loosely typed so an unexpected status/priority value from the API renders
  // an uncolored chip instead of throwing (STATUS_COLORS/PRIORITY_COLORS are
  // only guaranteed to cover the values our own TaskStatus/TasksPriority types know about).
  readonly statusColors: Partial<Record<string, { bg: string; color: string }>> = STATUS_COLORS;
  readonly priorityColors: Partial<Record<string, { bg: string; color: string }>> = PRIORITY_COLORS;

  readonly isOverdue = isOverdue;
  readonly formatDate = formatDate;

  ngOnInit(): void {
    this.store.dispatch(TasksActions.fetchTasksRequest());
  }

  handleSort(field: SortField, currentSort: { field: SortField; direction: SortDirection }): void {
    const direction: SortDirection = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    this.store.dispatch(TasksActions.setSort({ field, direction }));
  }

  activeFilterCount(filters: TaskFilters): number {
    return (
      filters.status.length +
      filters.priority.length +
      (filters.dueDateFrom ? 1 : 0) +
      (filters.dueDateTo ? 1 : 0) +
      (filters.titleSearch ? 1 : 0)
    );
  }

  removeStatus(status: TaskStatus, currentStatuses: TaskStatus[]): void {
    this.store.dispatch(
      TasksActions.setFilters({ filters: { status: currentStatuses.filter((s) => s !== status) } })
    );
  }

  removePriority(priority: TasksPriority, currentPriorities: TasksPriority[]): void {
    this.store.dispatch(
      TasksActions.setFilters({ filters: { priority: currentPriorities.filter((p) => p !== priority) } })
    );
  }

  removeDueDateFrom(): void {
    this.store.dispatch(TasksActions.setFilters({ filters: { dueDateFrom: null } }));
  }

  removeDueDateTo(): void {
    this.store.dispatch(TasksActions.setFilters({ filters: { dueDateTo: null } }));
  }

  removeTitleSearch(): void {
    this.store.dispatch(TasksActions.setFilters({ filters: { titleSearch: null } }));
  }

  openAddTask(): void {
    this.dialog.open(AddTaskModalComponent, { width: '460px' });
  }

  openFilterDrawer(): void {
    this.dialog.open(FilterDrawerComponent, {
      position: { right: '0', top: '0' },
      height: '100vh',
      panelClass: 'filter-drawer-panel',
    });
  }

  openEdit(task: Task): void {
    this.dialog.open(EditTaskDialogComponent, { width: '480px', data: { taskId: task.id } });
  }

  openDelete(task: Task): void {
    this.dialog.open(DeleteTaskDialogComponent, { data: { task } });
  }
}
