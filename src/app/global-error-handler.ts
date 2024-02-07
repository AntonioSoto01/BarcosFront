import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: Error | HttpErrorResponse) {
    const toastr = this.injector.get(ToastrService);

    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        toastr.error('No Internet Connection');
      } else {
        // Display the server's error message
        toastr.error(`${error.status} - ${error.error}`);
      }
    } else {
      toastr.error(error.message);
    }
  }
}