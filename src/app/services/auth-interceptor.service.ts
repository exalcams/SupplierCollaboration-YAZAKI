import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authorizationData = JSON.parse(localStorage.getItem('authorizationData'));
        if (authorizationData) {
            const token: string = authorizationData['access_token'];

            if (token) {
                request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
            }
        }

        if (!request.headers.has('Content-Type') && !request.url.includes('AddASNAttachment')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            })
        );
    }
}
