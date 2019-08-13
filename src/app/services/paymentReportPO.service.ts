import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IPaymentReportPO } from 'app/models/paymentReportPO.model';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class PaymentReportPOService {
    baseAddress: string;
    clientId: string;

    constructor(private _httpClient: HttpClient, private datePipe: DatePipe) {
        this.baseAddress = environment.baseAddress;
        this.clientId = environment.clientId;
    }

    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }

    getReport(poNumber: string, fromDate: Date, toDate: Date, vendorCode: string): Observable<IPaymentReportPO[] | string> {
        return this._httpClient
            .get<any>(
                `${
                    this.baseAddress
                }api/PaymentReport/GetPaymentReportPO?PONumber= ${poNumber}&VendorCode=${vendorCode}&FromDate=${this.datePipe.transform(
                    fromDate,
                    'yyyy-MM-dd'
                )}&ToDate=${this.datePipe.transform(toDate, 'yyyy-MM-dd')}`
            )
            .pipe(catchError(this.errorHandler));
    }
}
