
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      let message = 'Error inesperado';

      if (error.status === 403) {
        message = 'No tienes permisos para esta acción';
      }

      if (error.status === 500) {
        message = 'Error interno del servidor';
      }

      snackBar.open(message, 'Cerrar', {
        duration: 3000
      });

      return throwError(() => error);
    })
  );
};
