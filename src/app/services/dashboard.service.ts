import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { PO_Notifications, DashboardStatus, PO_DeliveryStatus, PO_PurchaseOrderDetails, POView, PO_OrderAcknowledgement, PO_OrderLookUpDetails } from 'app/models/dashboard';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AttachmentDetails } from 'app/allModules/orderacknowledgment/orderacknowledgment/orderacknowledgment.component';
import { Auxiliary, ASN } from 'app/models/asn';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseAddress: string;

  /**
  * Constructor
  *
  * @param {HttpClient} _httpClient
  */

  constructor(private _authService: AuthService, private _httpClient: HttpClient) {
    this.baseAddress = _authService.baseAddress;
  }

  // GetAllPoList(): Observable<POView[] | string> {
  //   return this._httpClient.get<POView[]>(`${this.baseAddress}api/DashBoardController/GetPoList`).pipe(catchError(this.errorHandler));
  // }
  GetASNHeader(): Observable<ASN[] | string> {
    return this._httpClient.get<ASN[]>(`${this.baseAddress}api/DashBoardController/GetASNHeader`).pipe(catchError(this.errorHandler));
  }
  GetAllPONotifications(): Observable<PO_Notifications | string> {
    return this._httpClient.get<PO_Notifications>(`${this.baseAddress}api/DashBoardController/GetAllPONotifications`).pipe(catchError(this.errorHandler));
  }
  GetAllDashboardStatus(): Observable<DashboardStatus | string> {
    return this._httpClient.get<DashboardStatus>(`${this.baseAddress}api/DashBoardController/GetDashboard`).pipe(catchError(this.errorHandler));
  }
  GetAllPODeliveryStatus(): Observable<PO_DeliveryStatus | string> {
    return this._httpClient.get<PO_DeliveryStatus>(`${this.baseAddress}api/DashBoardController/GetPODeliveryStatus`).pipe(catchError(this.errorHandler));
  }
  GetPOPurchaseOrderDetails(PO_Id: any): Observable<PO_PurchaseOrderDetails | string> {
    // alert(PO_Id);
    return this._httpClient.get<PO_PurchaseOrderDetails>(`${this.baseAddress}api/DashBoardController/GetPOPurchaseOrderDetails?PO_Id=${PO_Id}`).pipe(catchError(this.errorHandler));
  }
  GetPOOrderAcknowledgement(PO_Id: any, Item: string): Observable<PO_OrderAcknowledgement | string> {
    // alert(PO_Id);
    return this._httpClient.get<PO_OrderAcknowledgement>(`${this.baseAddress}api/DashBoardController/GetPO_OrderAcknowledgement?PO_Id=${PO_Id}&Item=${Item}`).pipe(catchError(this.errorHandler));
  }
  GetPOOrderLookUpDetails(PO_Id: any, Item: string): Observable<PO_OrderLookUpDetails | string> {
    // alert(PO_Id);
    return this._httpClient.get<PO_OrderLookUpDetails>(`${this.baseAddress}api/DashBoardController/GetPOOrderLookUpItemDetails?PO_Id=${PO_Id}&Item=${Item}`).pipe(catchError(this.errorHandler));
  }
  GetAttachmentViewsByAppID(APPID: number, APPNumber: number): Observable<AttachmentDetails[] | string> {
    return this._httpClient.get<AttachmentDetails[]>(`${this.baseAddress}api/DashBoardController/GetAttachmentViewsByAppID?APPID=${APPID}&APPNumber=${APPNumber}`)
      .pipe(catchError(this.errorHandler));
  }
  AddOrderAcknowledgementAttachment(auxiliary: Auxiliary, selectedFiles: File[]): Observable<any> {
    const formData: FormData = new FormData();
    if (selectedFiles && selectedFiles.length) {
      selectedFiles.forEach(x => {
        formData.append(x.name, x, x.name);
      });
    }
    formData.append('APPID', auxiliary.APPID.toString());
    formData.append('APPNumber', auxiliary.APPNumber.toString());
    formData.append('CreatedBy', auxiliary.CreatedBy);
    return this._httpClient.post<any>(`${this.baseAddress}api/DashBoardController/AddOrderAcknowledgementAttachment`,
      formData,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));

  }
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error.error_description || error.error || error.message || 'Server Error');
  }
}
