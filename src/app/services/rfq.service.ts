import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import {
    RFQView, PurchaseRequisition, RFQAllocationView, RFQResponseView,
    PurchaseRequisitionItem, RFQHeaderVendorView, RFQWithResponseView, RFQResponseReceivedView, RFQRankView, RFQAwardVendorView, RFQEvaluationView, PurchaseRequisitionStatusCount, RFQStatusCount, PriorityParameter, RFQResponseTechRating, RFQResponseTechRatingView, RFQVendorRank, RFQHeader
} from 'app/models/rfq.model';
import { Auxiliary, AuxiliaryView } from 'app/models/asn';
import { Guid } from 'guid-typescript';

@Injectable({
    providedIn: 'root'
})
export class RFQService {

    baseAddress: string;
    constructor(private _httpClient: HttpClient, _authService: AuthService) {
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
    GetPurchaseRequisitionStatusCount(): Observable<PurchaseRequisitionStatusCount | string> {
        return this._httpClient.get<PurchaseRequisitionStatusCount>(`${this.baseAddress}api/RFQ/GetPurchaseRequisitionStatusCount`)
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
    GetRFQByRFQID(RFQID: number): Observable<RFQView | string> {
        return this._httpClient.get<RFQView>(`${this.baseAddress}api/RFQ/GetRFQByRFQID?RFQID=${RFQID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQByIDAndVendor(RFQID: number, VendorID: string): Observable<RFQWithResponseView | string> {
        return this._httpClient.get<RFQWithResponseView>(`${this.baseAddress}api/RFQ/GetRFQByIDAndVendor?RFQID=${RFQID}&VendorID=${VendorID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQStatusCount(): Observable<RFQStatusCount | string> {
        return this._httpClient.get<RFQStatusCount>(`${this.baseAddress}api/RFQ/GetRFQStatusCount`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQStatusCountByBuyer(UserID: Guid): Observable<RFQStatusCount | string> {
        return this._httpClient.get<RFQStatusCount>(`${this.baseAddress}api/RFQ/GetRFQStatusCountByBuyer?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllCompletedRFQByBuyer(UserID: Guid): Observable<RFQEvaluationView[] | string> {
        return this._httpClient.get<RFQEvaluationView[]>(`${this.baseAddress}api/RFQ/GetAllCompletedRFQByBuyer?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllCompletedRFQByVendor(UserID: Guid): Observable<RFQHeaderVendorView[] | string> {
        return this._httpClient.get<RFQHeaderVendorView[]>(`${this.baseAddress}api/RFQ/GetAllCompletedRFQByVendor?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQStatusCountByVendor(UserID: Guid): Observable<RFQStatusCount | string> {
        return this._httpClient.get<RFQStatusCount>(`${this.baseAddress}api/RFQ/GetRFQStatusCountByVendor?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllAllocatedRFQByVendor(UserID: Guid): Observable<RFQHeaderVendorView[] | string> {
        return this._httpClient.get<RFQHeaderVendorView[]>(`${this.baseAddress}api/RFQ/GetAllAllocatedRFQByVendor?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllRespondedRFQByVendor(UserID: Guid): Observable<RFQHeaderVendorView[] | string> {
        return this._httpClient.get<RFQHeaderVendorView[]>(`${this.baseAddress}api/RFQ/GetAllRespondedRFQByVendor?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllArchivedRFQByVendor(UserID: Guid): Observable<RFQHeaderVendorView[] | string> {
        return this._httpClient.get<RFQHeaderVendorView[]>(`${this.baseAddress}api/RFQ/GetAllArchivedRFQByVendor?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQResponseReceivedByRFQID(RFQID: number): Observable<RFQResponseReceivedView[] | string> {
        return this._httpClient.get<RFQResponseReceivedView[]>(`${this.baseAddress}api/RFQ/GetRFQResponseReceivedByRFQID?RFQID=${RFQID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllCompletedPurchaseRequisitionByVendor(UserID: Guid): Observable<PurchaseRequisition[] | string> {
        return this._httpClient.get<PurchaseRequisition[]>(`${this.baseAddress}api/RFQ/GetAllCompletedPurchaseRequisitionByVendor?UserID=${UserID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQByStatus(Status: string): Observable<RFQHeader[] | string> {
        return this._httpClient.get<RFQHeader[]>(`${this.baseAddress}api/RFQ/GetRFQByStatus?Status=${Status}`)
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
    GetRFQItemAttachments(APPID: number, APPNumber: number, HeaderNumber: string): Observable<AuxiliaryView[] | string> {
        return this._httpClient.get<AuxiliaryView[]>(`${this.baseAddress}api/RFQ/GetRFQItemAttachments?APPID=${APPID}&APPNumber=${APPNumber}&HeaderNumber=${HeaderNumber}`)
            .pipe(catchError(this.errorHandler));
    }

    DownloadRFQItemAttachment(APPID: number, APPNumber: number, AttachmentNumber: number, HeaderNumber: string): Observable<Blob | string> {
        return this._httpClient.
            get(`${this.baseAddress}api/RFQ/DownloadRFQItemAttachment?APPID=${APPID}&APPNumber=${APPNumber}&AttachmentNumber=${AttachmentNumber}&HeaderNumber=${HeaderNumber}`, {
                responseType: 'blob',
                headers: new HttpHeaders().append('Content-Type', 'application/json')
            })
            .pipe(catchError(this.errorHandler));
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

    ArchiveSelectedRFQs(RFQs: RFQHeaderVendorView[]): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/ArchiveSelectedRFQs`,
            RFQs,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
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

    GetRFQRanksByRFQID(RFQID: number, CreatedBy: string): Observable<RFQVendorRank[] | string> {
        return this._httpClient.get<RFQVendorRank[]>(`${this.baseAddress}api/RFQ/GetRFQRanksByRFQID?RFQID=${RFQID}&CreatedBy=${CreatedBy}`)
            .pipe(catchError(this.errorHandler));
    }

    AwardSelectedVendor(RFQAwardVendor: RFQAwardVendorView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/AwardSelectedVendor`,
            RFQAwardVendor,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetAwarderedRFQByRFQID(RFQID: number): Observable<RFQRankView[] | string> {
        return this._httpClient.get<RFQRankView[]>(`${this.baseAddress}api/RFQ/GetAwarderedRFQByRFQID?RFQID=${RFQID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllPriorityParameters(): Observable<PriorityParameter[] | string> {
        return this._httpClient.get<PriorityParameter[]>(`${this.baseAddress}api/RFQ/GetAllPriorityParameters`)
            .pipe(catchError(this.errorHandler));
    }

    GetRFQParameterPriorityByRFQID(RFQID: number): Observable<PriorityParameter[] | string> {
        return this._httpClient.get<PriorityParameter[]>(`${this.baseAddress}api/RFQ/GetRFQParameterPriorityByRFQID?RFQID=${RFQID}`)
            .pipe(catchError(this.errorHandler));
    }

    CreateRFQResponseTechRating(rfqResponseTechRatings: RFQResponseTechRating[]): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/RFQ/CreateRFQResponseTechRating`,
            rfqResponseTechRatings,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetRFQResponseTechRatingByApprover(RFQID: number, CreatedBy: string): Observable<RFQResponseTechRating | string> {
        return this._httpClient.get<RFQResponseTechRating>
            (`${this.baseAddress}api/RFQ/GetRFQResponseTechRatingByApprover?RFQID=${RFQID}&CreatedBy=${CreatedBy}`)
            .pipe(catchError(this.errorHandler));
    }
    GetRFQResponseTechRatings(RFQID: number, VendorID: string): Observable<RFQResponseTechRatingView[] | string> {
        return this._httpClient.get<RFQResponseTechRatingView[]>
            (`${this.baseAddress}api/RFQ/GetRFQResponseTechRatings?RFQID=${RFQID}&VendorID=${VendorID}`)
            .pipe(catchError(this.errorHandler));
    }
}
