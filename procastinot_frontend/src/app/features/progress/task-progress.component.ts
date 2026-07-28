import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { PIE_COLORS, PIE_FALLBACK_PALETTE, STATUS_COLORS } from '@app/core/models';
import type { TaskCountData, TaskPercentData, TaskStatus } from '@app/core/models';
import { ProgressActions } from '@app/store/progress/progress.actions';
import {
  selectProgressCount,
  selectProgressLoading,
  selectProgressPercent,
  selectProgressTotal,
} from '@app/store/progress/progress.selectors';

type CountKey = keyof Omit<TaskCountData, 'totalTasks'>;
type PercentKey = keyof TaskPercentData;

const COUNT_KEYS: CountKey[] = ['toDoTasks', 'inProgressTasks', 'inReviewTasks', 'completedTasks'];
const PERCENT_KEYS: PercentKey[] = ['toDoPercent', 'inProgressPercent', 'inReviewPercent', 'completedPercent'];

const STATUS_LABEL: Record<string, string> = {
  toDoTasks: 'To Do',
  toDoPercent: 'To Do',
  inProgressTasks: 'In Progress',
  inProgressPercent: 'In Progress',
  inReviewTasks: 'Review',
  inReviewPercent: 'Review',
  completedTasks: 'Done',
  completedPercent: 'Done',
};

const KEY_TO_STATUS: Record<string, TaskStatus> = {
  toDoTasks: 'TODO',
  toDoPercent: 'TODO',
  inProgressTasks: 'IN_PROGRESS',
  inProgressPercent: 'IN_PROGRESS',
  inReviewTasks: 'REVIEW',
  inReviewPercent: 'REVIEW',
  completedTasks: 'DONE',
  completedPercent: 'DONE',
};

const SIZE = 220;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 86;
const INNER_R = 52;
const GAP_DEG = 1.5;

function toXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(startDeg: number, endDeg: number): string {
  const o1 = toXY(CX, CY, OUTER_R, startDeg);
  const o2 = toXY(CX, CY, OUTER_R, endDeg);
  const i1 = toXY(CX, CY, INNER_R, endDeg);
  const i2 = toXY(CX, CY, INNER_R, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    `A ${INNER_R} ${INNER_R} 0 ${large} 0 ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

interface DonutSlice {
  key: string;
  path: string;
  color: string;
}

interface LegendRow {
  key: PercentKey;
  label: string;
  bg: string;
  chipColor: string;
  dotColor: string;
  pctLabel: string;
}

interface CountRow {
  key: CountKey;
  label: string;
  bg: string;
  color: string;
  value: number;
}

@Component({
  selector: 'app-task-progress',
  standalone: true,
  imports: [AsyncPipe, MatProgressSpinnerModule],
  templateUrl: './task-progress.component.html',
  styleUrl: './task-progress.component.scss',
})
export class TaskProgressComponent implements OnInit {
  private readonly store = inject(Store);

  readonly svgSize = SIZE;

  readonly count$ = this.store.select(selectProgressCount);
  readonly percent$ = this.store.select(selectProgressPercent);
  readonly loading$ = this.store.select(selectProgressLoading);
  readonly total$ = this.store.select(selectProgressTotal);

  ngOnInit(): void {
    this.store.dispatch(ProgressActions.fetchCountRequest());
    this.store.dispatch(ProgressActions.fetchPercentRequest());
  }

  buildSlices(percent: TaskPercentData): DonutSlice[] {
    const total = PERCENT_KEYS.reduce((sum, key) => sum + percent[key], 0);
    if (total === 0) return [];

    const slices: DonutSlice[] = [];
    let cursor = 0;

    PERCENT_KEYS.forEach((key, idx) => {
      const value = percent[key];
      if (value === 0) return;
      const sweep = (value / total) * 360;
      const startDeg = cursor + GAP_DEG / 2;
      const endDeg = cursor + sweep - GAP_DEG / 2;
      const color = PIE_COLORS[key] ?? PIE_FALLBACK_PALETTE[idx % PIE_FALLBACK_PALETTE.length];
      slices.push({ key, path: slicePath(startDeg, endDeg), color });
      cursor += sweep;
    });

    return slices;
  }

  buildLegend(percent: TaskPercentData): LegendRow[] {
    return PERCENT_KEYS.map((key, idx) => {
      const statusKey = KEY_TO_STATUS[key];
      const bg = STATUS_COLORS[statusKey]?.bg ?? '#f5f5f5';
      const chipColor = STATUS_COLORS[statusKey]?.color ?? '#333';
      const dotColor = PIE_COLORS[key] ?? PIE_FALLBACK_PALETTE[idx % PIE_FALLBACK_PALETTE.length];
      const pct = percent[key];
      const pctLabel = pct % 1 !== 0 ? pct.toFixed(1) : String(pct);
      return { key, label: STATUS_LABEL[key], bg, chipColor, dotColor, pctLabel };
    });
  }

  buildCountRows(count: TaskCountData): CountRow[] {
    return COUNT_KEYS.map((key) => {
      const statusKey = KEY_TO_STATUS[key];
      const bg = STATUS_COLORS[statusKey]?.bg ?? '#f5f5f5';
      const color = STATUS_COLORS[statusKey]?.color ?? '#333';
      return { key, label: STATUS_LABEL[key], bg, color, value: count[key] };
    });
  }
}
