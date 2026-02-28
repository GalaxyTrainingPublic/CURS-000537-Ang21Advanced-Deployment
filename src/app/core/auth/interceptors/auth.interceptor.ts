import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

let isRefreshing = false;
let refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = tokenService.getAccessToken();

  let authReq = req;

  if (
    accessToken &&
    !req.url.includes('/auth/login') &&
    !req.url.includes('/auth/refresh')
  ) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (
        error.status === 401 &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/refresh')
      ) {

        if (!isRefreshing) {

          isRefreshing = true;
          refreshSubject.next(null);

          return authService.refreshToken().pipe(

            switchMap((response) => {

              isRefreshing = false;
              authService.saveTokens(
                response.accessToken,
                response.refreshToken
              );

              refreshSubject.next(response.accessToken);
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });

              return next(newReq);
            }),

            catchError((refreshError) => {

              isRefreshing = false;

              authService.clearTokens();
              router.navigate(['/login']);

              return throwError(() => refreshError);
            })
          );

        } else {
          return refreshSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token =>
              next(req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              }))
            )
          );
        }
      }

      return throwError(() => error);
    })
  );
};
