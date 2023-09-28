import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  construct() {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(error => {
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
          console.log(errorMessage)
        } else {
          // backend error
          errorMessage = `Server-side error: ${error.status} ${error.message}`;
          console.log(errorMessage);
        }
        
        // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.
        return throwError(errorMessage);
      })
    );
  }
}