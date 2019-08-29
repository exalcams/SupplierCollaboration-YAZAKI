import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CAPAHeader, CAPAAllocation, CAPAHeaderView, CAPAAllocationVendorView, CAPAResponse, CAPAStatusView, CAPAResponseView } from 'app/models/document-collection.model';
import { DatePipe } from '@angular/common';
import { Guid } from 'guid-typescript';

@Injectable({
    providedIn: 'root'
})
export class DocumentCollectionService {

    baseAddress: string;
    constructor(private _httpClient: HttpClient,
        private _authService: AuthService,
        private _datePipe: DatePipe) {
        this.baseAddress = _authService.baseAddress;
    }

    // Error Handler
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }

    CreateCAPA(capaHeader: CAPAHeader, CAPAAppID: number, file: File): Observable<any> {
        const formData: FormData = new FormData();
        if (file && file.name) {
            formData.append('uploadFile', file, file.name);
        }
        formData.append('APPID', CAPAAppID.toString());
        formData.append('Title', capaHeader.Title);
        formData.append('LongText', capaHeader.LongText);
        formData.append('DueDate', this._datePipe.transform(capaHeader.DueDate, 'yyyy-MM-dd'));
        formData.append('CreatedBy', capaHeader.CreatedBy);
        return this._httpClient.post<any>(`${this.baseAddress}api/DocumentCollection/CreateCAPA`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        )
            .pipe(catchError(this.errorHandler));
    }
    UpdateCAPA(capaHeader: CAPAHeader, CAPAAppID: number, file: File): Observable<any> {
        const formData: FormData = new FormData();
        if (file && file.name) {
            formData.append('uploadFile', file, file.name);
        }
        formData.append('APPID', CAPAAppID.toString());
        formData.append('Title', capaHeader.Title);
        formData.append('LongText', capaHeader.LongText);
        formData.append('DueDate', this._datePipe.transform(capaHeader.DueDate, 'yyyy-MM-dddd'));

        return this._httpClient.post<any>(`${this.baseAddress}api/DocumentCollection/CreateCAPA`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        )
            .pipe(catchError(this.errorHandler));
    }
    CreateCAPAAllocation(RFQAllocations: CAPAAllocation[]): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/DocumentCollection/CreateCAPAAllocation`,
            RFQAllocations,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    GetCAPAByUser(UserID: Guid): Observable<CAPAHeaderView[] | string> {
        return this._httpClient.get<CAPAHeaderView[] | string>(`${this.baseAddress}api/DocumentCollection/GetCAPAByUser?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetCAPAByVendor(UserID: Guid): Observable<CAPAHeaderView[] | string> {
        return this._httpClient.get<CAPAHeaderView[] | string>(`${this.baseAddress}api/DocumentCollection/GetCAPAByVendor?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetCAPAAllocationVendorViewByCAPA(CAPAID: number): Observable<CAPAAllocationVendorView[] | string> {
        return this._httpClient.get<CAPAAllocationVendorView[] | string>(`${this.baseAddress}api/DocumentCollection/GetCAPAAllocationVendorViewByCAPA?CAPAID=${CAPAID}`)
            .pipe(catchError(this.errorHandler));
    }

    CreateCAPAResponse(respons: CAPAResponse): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/DocumentCollection/CreateCAPAResponse`,
            respons,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetCAPAResponseByCAPA(CAPAID: number): Observable<CAPAResponseView[] | string> {
        return this._httpClient.get<CAPAResponseView[] | string>(`${this.baseAddress}api/DocumentCollection/GetCAPAResponseByCAPA?CAPAID=${CAPAID}`)
            .pipe(catchError(this.errorHandler));
    }
    UpdateCAPAStatus(respons: CAPAStatusView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/DocumentCollection/UpdateCAPAStatus`,
            respons,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
}
