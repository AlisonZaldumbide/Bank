import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { mapHttpError } from '../utils/http-error.util';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const apiRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return next.handle(apiRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => mapHttpError(error));
      })
    );
  }
}
