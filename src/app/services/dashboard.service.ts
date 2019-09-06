import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import {
    PO_Notifications,
    DashboardStatus,
    PO_DeliveryStatus,
    PO_PurchaseOrderDetails,
    POView,
    PO_OrderAcknowledgement,
    PO_OrderLookUpDetails
} from 'app/models/dashboard';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AttachmentDetails } from 'app/allModules/orderacknowledgment/orderacknowledgment/orderacknowledgment.component';
import { Auxiliary, ASN } from 'app/models/asn';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
    GetASNHeader(): Observable<ASN[] | string> {
        return this._httpClient.get<ASN[]>(`${this.baseAddress}api/DashBoardController/GetASNHeader`).pipe(catchError(this.errorHandler));
    }
    GetAllPONotifications(): Observable<PO_Notifications | string> {
        return this._httpClient
            .get<PO_Notifications>(`${this.baseAddress}api/DashBoardController/GetAllPONotifications`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllDashboardStatus(): Observable<DashboardStatus | string> {
        return this._httpClient.get<DashboardStatus>(`${this.baseAddress}api/DashBoardController/GetDashboard`).pipe(catchError(this.errorHandler));
    }
    GetAllPODeliveryStatus(Value: any): Observable<PO_DeliveryStatus | string> {
        return this._httpClient
            .get<PO_DeliveryStatus>(`${this.baseAddress}api/DashBoardController/GetPODeliveryStatus?Value=${Value}`)
            .pipe(catchError(this.errorHandler));
    }
    GetPOPurchaseOrderDetails(PO_Id: any): Observable<PO_PurchaseOrderDetails | string> {
        // alert(PO_Id);
        return this._httpClient
            .get<PO_PurchaseOrderDetails>(`${this.baseAddress}api/DashBoardController/GetPOPurchaseOrderDetails?PO_Id=${PO_Id}`)
            .pipe(catchError(this.errorHandler));
    }
    GetPOOrderAcknowledgement(PO_Id: any, Item: string): Observable<PO_OrderAcknowledgement | string> {
        // alert(PO_Id);
        return this._httpClient
            .get<PO_OrderAcknowledgement>(`${this.baseAddress}api/DashBoardController/GetPO_OrderAcknowledgement?PO_Id=${PO_Id}&Item=${Item}`)
            .pipe(catchError(this.errorHandler));
    }
    GetPOOrderLookUpDetails(PO_Id: any, Item: string): Observable<PO_OrderLookUpDetails | string> {
        // alert(PO_Id);
        return this._httpClient
            .get<PO_OrderLookUpDetails>(`${this.baseAddress}api/DashBoardController/GetPOOrderLookUpItemDetails?PO_Id=${PO_Id}&Item=${Item}`)
            .pipe(catchError(this.errorHandler));
    }

    CreateOrderAcknowledgement(Acknowledgement: PO_OrderAcknowledgement): Observable<any> {
        return this._httpClient
            .post<any>(`${this.baseAddress}api/DashBoardController/CreateOrderAcknowledgement`, Acknowledgement)
            .pipe(catchError(this.errorHandler));
    }
    // UpdateOrderAcknowledgement(asn: PO_OrderAcknowledgement): Observable<any> {
    //   return this._httpClient.post<any>(`${this.baseAddress}api/DashBoardController/UpdateOrderAcknowledgement`,
    //     asn,
    //     {
    //       headers: new HttpHeaders({
    //         'Content-Type': 'application/json'
    //       })
    //     })
    //     .pipe(catchError(this.errorHandler));
    // }

    GetAttachmentViewsByAppID(APPID: number, item: string, PO: string): Observable<AttachmentDetails[] | string> {
        return this._httpClient
            .get<AttachmentDetails[]>(`${this.baseAddress}api/DashBoardController/GetAttachmentViewsByAppID?APPID=${APPID}&item=${item}&PO=${PO}`)
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
        formData.append('PO', auxiliary.HeaderNumber);
        formData.append('CreatedBy', auxiliary.CreatedBy);
        return this._httpClient
            .post<any>(
                `${this.baseAddress}api/DashBoardController/AddOrderAcknowledgementAttachment`,
                formData
                // {
                //   headers: new HttpHeaders({
                //     'Content-Type': 'application/json'
                //   })
                // }
            )
            .pipe(catchError(this.errorHandler));
    }
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error.error_description || error.error || error.message || 'Server Error');
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet', worksheet);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    GetToShipOpen(): Observable<POView[] | string> {
        return this._httpClient.get<POView[]>(`${this.baseAddress}api/DashBoardController/GetToShipOpen`).pipe(catchError(this.errorHandler));
    }
    GetToShipWeek(): Observable<POView[] | string> {
        return this._httpClient.get<POView[]>(`${this.baseAddress}api/DashBoardController/GetToShipWeek`).pipe(catchError(this.errorHandler));
    }
    GetOpenPoList(): Observable<POView[] | string> {
        return this._httpClient.get<POView[]>(`${this.baseAddress}api/DashBoardController/GetOpenPoList`).pipe(catchError(this.errorHandler));
    }
    GetOpenFromPO(): Observable<POView[] | string> {
        return this._httpClient.get<POView[]>(`${this.baseAddress}api/DashBoardController/GetOpenFromPO`).pipe(catchError(this.errorHandler));
    }
    GetInTransitList(): Observable<POView[] | string> {
        return this._httpClient.get<POView[]>(`${this.baseAddress}api/DashBoardController/GetInTransitList`).pipe(catchError(this.errorHandler));
    }
    GetInTransitReceivedList(): Observable<POView[] | string> {
        return this._httpClient
            .get<POView[]>(`${this.baseAddress}api/DashBoardController/GetInTransitReceivedList`)
            .pipe(catchError(this.errorHandler));
    }
    GetPaymentDueList(): Observable<POView[] | string> {
        return this._httpClient.get<POView[]>(`${this.baseAddress}api/DashBoardController/GetPaymentDueList`).pipe(catchError(this.errorHandler));
    }
    GetPaymentReceivedList(): Observable<POView[] | string> {
        return this._httpClient
            .get<POView[]>(`${this.baseAddress}api/DashBoardController/GetPaymentReceivedList`)
            .pipe(catchError(this.errorHandler));
    }
    GetPOQulity(): Observable<number | string> {
        return this._httpClient.get<number>(`${this.baseAddress}api/DashBoardController/GetPOQulity`).pipe(catchError(this.errorHandler));
    }
}
