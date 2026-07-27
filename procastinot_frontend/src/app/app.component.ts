import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastListenerComponent } from '@app/layout/toast/toast-listener.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastListenerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'procastinot_frontend';
}
