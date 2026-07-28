export interface TaskCountData {
  totalTasks: number;
  toDoTasks: number;
  inProgressTasks: number;
  inReviewTasks: number;
  completedTasks: number;
}

export interface TaskPercentData {
  toDoPercent: number;
  inProgressPercent: number;
  inReviewPercent: number;
  completedPercent: number;
}
