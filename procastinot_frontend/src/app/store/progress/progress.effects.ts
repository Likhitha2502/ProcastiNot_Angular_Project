import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { API } from '@app/core/constants/api-routes.const';
import { apiUrl } from '@app/core/utils/api-url.util';
import { getResponseError } from '@app/core/utils/response.util';
import type { TaskCountData, TaskPercentData } from '@app/core/models';

import { ProgressActions } from './progress.actions';

@Injectable()
export class ProgressEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProgressActions.fetchCountRequest),
      switchMap(() =>
        this.http.get<TaskCountData>(apiUrl(API.progress.count)).pipe(
          map((count) => ProgressActions.fetchCountSuccess({ count })),
          catchError((error: HttpErrorResponse) =>
            of(ProgressActions.fetchCountFailure({ error: getResponseError(error) || 'Failed to load task counts.' }))
          )
        )
      )
    )
  );

  fetchPercent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProgressActions.fetchPercentRequest),
      switchMap(() =>
        this.http.get<TaskPercentData>(apiUrl(API.progress.percent)).pipe(
          map((percent) => ProgressActions.fetchPercentSuccess({ percent })),
          catchError((error: HttpErrorResponse) =>
            of(
              ProgressActions.fetchPercentFailure({
                error: getResponseError(error) || 'Failed to load task percentages.',
              })
            )
          )
        )
      )
    )
  );
}
