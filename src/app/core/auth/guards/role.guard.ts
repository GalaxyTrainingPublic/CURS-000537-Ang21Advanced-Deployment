import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getAccessToken();

  const expectedRoles: string[] = route.data['roles'] ?? [route.data['role']];

  if (!expectedRoles) {
    return true;
  }

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const decoded: any = jwtDecode(token);

  const userRoles: string[] = decoded.roles || [];

  const hasRole = expectedRoles.some((role) => userRoles.includes(`ROLE_${role}`));

  if (!hasRole) {
    router.navigate(['/403']);
    return false;
  }

  return true;
};
