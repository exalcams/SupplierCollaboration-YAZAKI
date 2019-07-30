import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { ASN, VendorLocation, ASNHeaderView } from 'app/models/asn';

@Injectable({
    providedIn: 'root'
})
export class ASNService {

    baseAddress: string;
    constructor(private _httpClient: HttpClient, private _authService: AuthService) {
        this.baseAddress = _authService.baseAddress;
    }

    // Error Handler
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }

    // App
    CreateASN(asn: ASN): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/ASN/CreateASN`,
            asn,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetAllASNHeaderViews(): Observable<ASNHeaderView[] | string> {
        return this._httpClient.get<ASNHeaderView[]>(`${this.baseAddress}api/ASN/GetAllASNHeaderViews`)
            .pipe(catchError(this.errorHandler));
    }
    GetASNByTransID(TransID: number): Observable<ASN | string> {
        return this._httpClient.get<ASN>(`${this.baseAddress}api/ASN/GetASNByTransID?TransID=${TransID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllVendorLocations(): Observable<VendorLocation[] | string> {
        return this._httpClient.get<VendorLocation[]>(`${this.baseAddress}api/ASN/GetAllVendorLocations`)
            .pipe(catchError(this.errorHandler));
    }

}
