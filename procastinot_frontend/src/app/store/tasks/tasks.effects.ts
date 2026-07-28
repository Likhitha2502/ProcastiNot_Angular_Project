import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

import { API } from '@app/core/constants/api-routes.const';
import { apiUrl } from '@app/core/utils/api-url.util';
import { getResponseError } from '@app/core/utils/response.util';
import type { Task } from '@app/core/models';

import { TasksActions } from './tasks.actions';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  fetchTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.fetchTasksRequest),
      switchMap(() =>
        this.http.get<Task[]>(apiUrl(API.tasks.getAll)).pipe(
          map((tasks) => TasksActions.fetchTasksSuccess({ tasks })),
          catchError((error: HttpErrorResponse) =>
            of(TasksActions.fetchTasksFailure({ error: getResponseError(error) || 'Failed to load tasks.' }))
          )
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTaskRequest),
      switchMap(({ payload }) =>
        this.http.post<Task>(apiUrl(API.tasks.create), payload).pipe(
          mergeMap((task) => of(TasksActions.createTaskSuccess({ task }), TasksActions.fetchTasksRequest())),
          catchError((error: HttpErrorResponse) =>
            of(TasksActions.createTaskFailure({ error: getResponseError(error) || 'Failed to create task.' }))
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTaskRequest),
      switchMap(({ payload }) =>
        this.http.put<Task>(apiUrl(API.tasks.update(payload.id)), payload.data).pipe(
          mergeMap(() => of(TasksActions.updateTaskSuccess(), TasksActions.fetchTasksRequest())),
          catchError((error: HttpErrorResponse) =>
            of(TasksActions.updateTaskFailure({ error: getResponseError(error) || 'Failed to update task.' }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTaskRequest),
      switchMap(({ id }) =>
        this.http.delete(apiUrl(API.tasks.delete(id))).pipe(
          mergeMap(() => of(TasksActions.deleteTaskSuccess(), TasksActions.fetchTasksRequest())),
          catchError((error: HttpErrorResponse) =>
            of(TasksActions.deleteTaskFailure({ error: getResponseError(error) || 'Failed to delete task.' }))
          )
        )
      )
    )
  );

  fetchTaskById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.fetchTaskByIdRequest),
      switchMap(({ id }) =>
        this.http.get<Task>(apiUrl(API.tasks.getById(id))).pipe(
          map((task) => TasksActions.fetchTaskByIdSuccess({ task })),
          catchError((error: HttpErrorResponse) =>
            of(TasksActions.fetchTaskByIdFailure({ error: getResponseError(error) || 'Failed to load task.' }))
          )
        )
      )
    )
  );
}
