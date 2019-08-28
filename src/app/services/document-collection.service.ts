import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CAPAHeader, CAPAAllocation } from 'app/models/document-collection.model';
import { DatePipe } from '@angular/common';

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
    UpdateCAPA(capaHeader: CAPAHeader,CAPAAppID: number, file: File): Observable<any> {
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
}
