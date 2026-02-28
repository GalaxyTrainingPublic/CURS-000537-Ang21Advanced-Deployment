import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('../app/features/router/features.routes').then((r) => r.FEATURES_ROUTER),
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '403',
    loadComponent: () =>
      import('./core/auth/components/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent,
      ),
  },

  {
    path: '**',
    redirectTo: '/pageNotFound',
    pathMatch: 'full',
  },
];
