import { HttpErrorResponse } from '@angular/common/http';

export const getResponseError = (error: HttpErrorResponse): string | null => {
  if (!error) return null;
  return error.error?.message || error.message || null;
};
