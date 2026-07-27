import { Injectable } from '@angular/core';

const TEMP_PASSWORD_FLAG = 'focusflow_temp_password';

@Injectable({ providedIn: 'root' })
export class TempAuthService {
  setTempPasswordFlag(): void {
    localStorage.setItem(TEMP_PASSWORD_FLAG, 'true');
  }

  isTempPassword(): boolean {
    return localStorage.getItem(TEMP_PASSWORD_FLAG) === 'true';
  }

  clearTempPasswordFlag(): void {
    localStorage.removeItem(TEMP_PASSWORD_FLAG);
  }
}
