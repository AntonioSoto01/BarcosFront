import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CsrfTokenInterceptor implements HttpInterceptor {

  constructor(private cookieService:CookieService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const csrfToken = event.headers.get('X-CSRF-TOKEN');
            console.log(event.headers)
          if (csrfToken) {
          this.cookieService.set('XSRF-TOKEN',csrfToken);
          console.log("token "+csrfToken)
          }
        }
      })
    );
  }
}
