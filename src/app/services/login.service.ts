import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { UserDetails } from 'app/models/user-details';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseAddress: string;
  clientId: string;

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
    // this.baseAddress = 'http://localhost:5171/';
    this.clientId = _authService.clientId;
  }

  // login(userName: string, password: string): Observable<any> {
  //   // tslint:disable-next-line:prefer-const
  //   let data = `grant_type=password&username=${userName}&password=${password}&client_id=${this.clientId}`;
  //   return this._httpClient.post<any>(`${this.baseAddress}token`, data, {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }
  //   }).pipe(map(res => res), catchError(this.errorHandler));
  // }
  // errorHandler(error: HttpErrorResponse): Observable<string> {
  //   return throwError(error.error.error_description || error.error || error.message || 'Server Error');
  // }
}
