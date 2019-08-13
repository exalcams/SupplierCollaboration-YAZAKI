import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IGatePassNoData, IGatePassModel } from 'app/models/gateEntry.model';

@Injectable({
    providedIn: 'root'
})
export class GateEntryService {
    baseAddress: string;
    clientId: string;

    constructor(private _httpClient: HttpClient) {
        this.baseAddress = environment.baseAddress;
        this.clientId = environment.clientId;
    }

    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }

    savePOGateEntry(data): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/GateEntry_Exit/CreateGateEntry`, data).pipe(catchError(this.errorHandler));
    }

    GetAllGatePassNoData(): Observable<IGatePassNoData[] | string> {
        return this._httpClient.get<IGatePassNoData[]>(`${this.baseAddress}api/GateEntry_Exit/GetAllGatePassNo`).pipe(catchError(this.errorHandler));
    }

    GetThisGatePassData(GT_No: string): Observable<IGatePassModel | string> {
        return this._httpClient
            .get<IGatePassModel>(`${this.baseAddress}api/GateEntry_Exit/GetThisGatePassData?GT_No=` + GT_No)
            .pipe(catchError(this.errorHandler));
    }
}
