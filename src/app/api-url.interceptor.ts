import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
  constructor(private router: Router) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith('/assets')) {
      return next.handle(req);
    }

    const request = req.clone({
      // url: environment.apiUrlSimple + req.url,
      withCredentials: true,
    });
    return next.handle(request);
  }

  private handleErrorRes(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case 401:
        this.router.navigateByUrl('/login', { replaceUrl: true });
        break;
    }
    return throwError(() => error);
  }
}
