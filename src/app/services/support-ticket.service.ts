import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  STCategoryView, STExpectedResultView, STReasonView, SupportTicketWithEmails,
  SupportTicketResponseView, SupportTicketResponse, SupportTicketStatusView
} from 'app/models/supportTicket.model';
import { Auxiliary } from 'app/models/asn';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {

  baseAddress: string;
  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  GetAllCategories(): Observable<STCategoryView[] | string> {
    return this._httpClient.get<STCategoryView[]>(`${this.baseAddress}api/SupportTicket/GetAllCategories`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllReasons(): Observable<STReasonView[] | string> {
    return this._httpClient.get<STReasonView[]>(`${this.baseAddress}api/SupportTicket/GetAllReasons`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllExpectedResults(): Observable<STExpectedResultView[] | string> {
    return this._httpClient.get<STExpectedResultView[]>(`${this.baseAddress}api/SupportTicket/GetAllExpectedResults`)
      .pipe(catchError(this.errorHandler));
  }
  CreateSupportTicket(supportTicketWithEmails: SupportTicketWithEmails): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/SupportTicket/CreateSupportTicket`,
      supportTicketWithEmails,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  AddSupportTicketAttachment(auxiliary: Auxiliary, selectedFiles: File[]): Observable<any> {
    const formData: FormData = new FormData();
    if (selectedFiles && selectedFiles.length) {
      selectedFiles.forEach(x => {
        formData.append(x.name, x, x.name);
      });
    }
    formData.append('APPID', auxiliary.APPID.toString());
    formData.append('APPNumber', auxiliary.APPNumber.toString());
    formData.append('CreatedBy', auxiliary.CreatedBy);
    return this._httpClient.post<any>(`${this.baseAddress}api/SupportTicket/AddSupportTicketAttachment`,
      formData,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));

  }

  GetSupportTicketByVendor(UserID: Guid): Observable<SupportTicketWithEmails[] | string> {
    return this._httpClient.get<SupportTicketWithEmails[]>(`${this.baseAddress}api/SupportTicket/GetSupportTicketByVendor?UserID=${UserID}`)
      .pipe(catchError(this.errorHandler));
  }
  GetSupportTicketByBuyer(UserID: Guid): Observable<SupportTicketWithEmails[] | string> {
    return this._httpClient.get<SupportTicketWithEmails[]>(`${this.baseAddress}api/SupportTicket/GetSupportTicketByBuyer?UserID=${UserID}`)
      .pipe(catchError(this.errorHandler));
  }
  CreateSupportTicketResponse(supportTicketResponse: SupportTicketResponse): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/SupportTicket/CreateSupportTicketResponse`,
      supportTicketResponse,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
  GetSupportTicketByTicketID(TicketID: number): Observable<SupportTicketWithEmails | string> {
    return this._httpClient.get<SupportTicketWithEmails>(`${this.baseAddress}api/SupportTicket/GetSupportTicketByTicketID?TicketID=${TicketID}`)
      .pipe(catchError(this.errorHandler));
  }
  GetSupportTicketResponseByTicketID(TicketID: number): Observable<SupportTicketResponseView[] | string> {
    return this._httpClient.get<SupportTicketResponseView[]>(`${this.baseAddress}api/SupportTicket/GetSupportTicketResponseByTicketID?TicketID=${TicketID}`)
      .pipe(catchError(this.errorHandler));
  }
  UpdateSupportTicketStatus(StatusView: SupportTicketStatusView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/SupportTicket/SupportTicketStatusView`,
      StatusView,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
}
