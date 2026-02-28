import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLink, Router } from '@angular/router';
import { IdleService } from './core/auth/services/idle.service';
import { AuthService } from './core/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app-ventas');

   private idleService = inject(IdleService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {

    /* this.idleService.idle$.subscribe(() => {
      console.log('Logout por inactividad');
      this.authService.logout();
      this.router.navigate(['/login']);
    });

    if (localStorage.getItem('access_token')) {
      this.idleService.startWatching();
    } */
  }
}
