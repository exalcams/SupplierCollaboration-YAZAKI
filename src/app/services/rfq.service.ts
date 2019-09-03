import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { AttachmentDetails } from 'app/allModules/orderacknowledgment/orderacknowledgment/orderacknowledgment.component';
import { RFQView, PurchaseRequisition, RFQAllocationView, RFQResponseView, PurchaseRequisitionItem, RFQHeaderView } from 'app/models/rfq.model';
import { Auxiliary } from 'app/models/asn';
import { Guid } from 'guid-typescript';

@Injectable({
    providedIn: 'root'
})
export class RFQService {

    baseAddress: string;
    constructor(private _httpClient: HttpClient, private _authService: AuthService) {
        this.baseAddress = _authService.baseAddress;
    }

    // Error Handler
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }

    // RFQ
    CreateRFQ(RFQ: RFQView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/CreateRFQ`,
            RFQ,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    UpdateRFQ(RFQ: RFQView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/UpdateRFQ`,
            RFQ,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetAllPurchaseRequisitions(): Observable<PurchaseRequisition[] | string> {
        return this._httpClient.get<PurchaseRequisition[]>(`${this.baseAddress}api/RFQ/GetAllPurchaseRequisitions`)
            .pipe(catchError(this.errorHandler));
    }
    GetPurchaseRequisitionsByRFQStatus(RFQStatus: string): Observable<PurchaseRequisition[] | string> {
        return this._httpClient.get<PurchaseRequisition[]>(`${this.baseAddress}api/RFQ/GetPurchaseRequisitionsByRFQStatus?RFQStatus=${RFQStatus}`)
            .pipe(catchError(this.errorHandler));
    }
    GetPurchaseRequisitionItemsByPRID(PRID: number): Observable<PurchaseRequisitionItem[] | string> {
        return this._httpClient.get<PurchaseRequisitionItem[]>(`${this.baseAddress}api/RFQ/GetPurchaseRequisitionItemsByPRID?PRID=${PRID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQByPurchaseRequisitionID(PurchaseRequisitionID: number): Observable<RFQView | string> {
        return this._httpClient.get<RFQView>(`${this.baseAddress}api/RFQ/GetRFQByPurchaseRequisitionID?PurchaseRequisitionID=${PurchaseRequisitionID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQByID(RFQID: number): Observable<RFQView | string> {
        return this._httpClient.get<RFQView>(`${this.baseAddress}api/RFQ/GetRFQByID?RFQID=${RFQID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllCompletedRFQByVendor(UserID: Guid): Observable<RFQHeaderView[] | string> {
        return this._httpClient.get<RFQHeaderView[]>(`${this.baseAddress}api/RFQ/GetAllCompletedRFQByVendor?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllCompletedPurchaseRequisitionByVendor(UserID: Guid): Observable<PurchaseRequisition[] | string> {
        return this._httpClient.get<PurchaseRequisition[]>(`${this.baseAddress}api/RFQ/GetAllCompletedPurchaseRequisitionByVendor?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    AddRFQAttachment(auxiliary: Auxiliary, selectedFiles: File[]): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('APPID', auxiliary.APPID.toString());
        formData.append('HeaderNumber', auxiliary.HeaderNumber.toString());

        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/AddRFQAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));

    }

    CreateRFQAllocation(RFQAllocations: RFQAllocationView[]): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/CreateRFQAllocation`,
            RFQAllocations,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    CreateRFQAllocationTemp(RFQAllocations: RFQAllocationView[]): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/CreateRFQAllocationTemp`,
            RFQAllocations,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetRFQAllocationByRFQID(RFQID: number): Observable<RFQAllocationView[] | string> {
        return this._httpClient.get<RFQAllocationView[]>(`${this.baseAddress}api/RFQ/GetRFQAllocationByRFQID?RFQID=${RFQID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQAllocationTempByRFQID(RFQID: number): Observable<RFQAllocationView[] | string> {
        return this._httpClient.get<RFQAllocationView[]>(`${this.baseAddress}api/RFQ/GetRFQAllocationTempByRFQID?RFQID=${RFQID}`)
            .pipe(catchError(this.errorHandler));
    }


    CreateRFQResponse(RFQResponse: RFQResponseView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/CreateRFQResponse`,
            RFQResponse,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    UpdateRFQResponse(RFQResponse: RFQResponseView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/UpdateRFQResponse`,
            RFQResponse,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    AddRFQResponseAttachment(auxiliary: Auxiliary, selectedFiles: File[]): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('APPID', auxiliary.APPID.toString());
        formData.append('HeaderNumber', auxiliary.HeaderNumber.toString());

        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/AddRFQResponseAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));

    }
}
