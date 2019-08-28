import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { ASN, VendorLocation, ASNHeaderView, Auxiliary, POView, AcknowledgementView } from 'app/models/asn';
import { AttachmentDetails } from 'app/allModules/orderacknowledgment/orderacknowledgment/orderacknowledgment.component';
import { Acknowledgement } from 'app/models/dashboard';

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
    UpdateASN(asn: ASN): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/ASN/UpdateASN`,
            asn,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    AddASNAttachment(auxiliary: Auxiliary, selectedFiles: File[]): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('APPID', auxiliary.APPID.toString());
        formData.append('APPNumber', auxiliary.APPNumber.toString());
        formData.append('CreatedBy', auxiliary.CreatedBy);
        return this._httpClient.post<any>(`${this.baseAddress}api/ASN/AddASNAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));

    }
    GetAllASNHeaderViews(): Observable<ASNHeaderView[] | string> {
        return this._httpClient.get<ASNHeaderView[]>(`${this.baseAddress}api/ASN/GetAllASNHeaderViews`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllPOByAcknowledgementStatus(Status: string): Observable<POView[] | string> {
        return this._httpClient.get<POView[]>(`${this.baseAddress}api/ASN/GetAllPOByAcknowledgementStatus?Status=${Status}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllPOByAckAndASNStatus(AckStatus: string, ASNStatus: string): Observable<POView[] | string> {
        return this._httpClient.get<POView[]>(`${this.baseAddress}api/ASN/GetAllPOByAckAndASNStatus?AckStatus=${AckStatus}&ASNStatus=${ASNStatus}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAcknowledgedPOByPO(PO: string, Item: string): Observable<POView | string> {
        return this._httpClient.get<POView>(`${this.baseAddress}api/ASN/GetAcknowledgedPOByPO?PO=${PO}&Item=${Item}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAcknowledgementsByPOAndItem(PO: string, Item: string): Observable<AcknowledgementView[] | string> {
        return this._httpClient.get<AcknowledgementView[]>(`${this.baseAddress}api/ASN/GetAcknowledgementsByPOAndItem?PO=${PO}&Item=${Item}`)
            .pipe(catchError(this.errorHandler));
    }
    GetASNByPO(PO: string, Item: string): Observable<ASN | string> {
        return this._httpClient.get<ASN>(`${this.baseAddress}api/ASN/GetASNByPO?PO=${PO}&Item=${Item}`)
            .pipe(catchError(this.errorHandler));
    }
    GetASNByTransID(TransID: number): Observable<ASN | string> {
        return this._httpClient.get<ASN>(`${this.baseAddress}api/ASN/GetASNByTransID?TransID=${TransID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAttachmentViewsByAppID(APPID: number, APPNumber: number): Observable<AttachmentDetails[] | string> {
        return this._httpClient.get<AttachmentDetails[]>(`${this.baseAddress}api/ASN/GetAttachmentViewsByAppID?APPID=${APPID}&APPNumber=${APPNumber}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllVendorLocations(): Observable<VendorLocation[] | string> {
        return this._httpClient.get<VendorLocation[]>(`${this.baseAddress}api/ASN/GetAllVendorLocations`)
            .pipe(catchError(this.errorHandler));
    }

}
