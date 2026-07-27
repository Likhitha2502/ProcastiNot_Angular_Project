import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { ROUTES } from '@app/core/constants/routes.const';
import { AuthActions } from '@app/store/auth/auth.actions';
import { ProfileActions } from '@app/store/profile/profile.actions';
import { selectUserProfile } from '@app/store/profile/profile.selectors';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet, MatIconModule, MatMenuModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly routes = ROUTES;
  readonly userProfile$ = this.store.select(selectUserProfile);

  ngOnInit(): void {
    this.store.dispatch(ProfileActions.fetchUserProfileRequest());
  }

  initials(firstName?: string, lastName?: string): string {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    return 'U';
  }

  goToTasks(): void {
    this.router.navigate([this.routes.tasks]);
  }

  goToProfile(): void {
    this.router.navigate([this.routes.userProfile]);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logoutRequest());
  }
}
