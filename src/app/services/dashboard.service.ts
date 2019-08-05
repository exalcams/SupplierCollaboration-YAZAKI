import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { PO_Notifications, DashboardStatus, PO_DeliveryStatus, PO_PurchaseOrderDetails, POView } from 'app/models/dashboard';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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

  GetAllPoList(): Observable<POView[] | string> {
    return this._httpClient.get<POView[]>(`${this.baseAddress}api/DashBoardController/GetPoList`).pipe(catchError(this.errorHandler));
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
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error.error_description || error.error || error.message || 'Server Error');
  }
}
