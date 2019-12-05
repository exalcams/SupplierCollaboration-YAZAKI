import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { PurchaseRequisitionView, RFQHeaderVendorView } from 'app/models/rfq.model';

@Injectable({
    providedIn: 'root'
})
export class ShareParameterService {
    // private PurchaseRequisitionEvent = new Subject<any>();
    public CurrentPurchaseRequisition: PurchaseRequisitionView;
    public CurrentRFQHeaderVendor: RFQHeaderVendorView;
    public CurrentRFQID: number;
    public CurrentPONumber: string;
    // constructor() {
    //     this.PurchaseRequisitionEvent = new Subject(null);
    // }
    GetPurchaseRequisition(): PurchaseRequisitionView {
        return this.CurrentPurchaseRequisition;
    }

    SetPurchaseRequisition(PurchaseRequisition: PurchaseRequisitionView): void {
        this.CurrentPurchaseRequisition = PurchaseRequisition;
    }

    SetRFQHeaderVendor(RFQHeaderVendor: RFQHeaderVendorView): void {
        this.CurrentRFQHeaderVendor = RFQHeaderVendor;
    }

    GetRFQHeaderVendor(): RFQHeaderVendorView {
        return this.CurrentRFQHeaderVendor;
    }

    SetRFQID(RFQID: number): void {
        this.CurrentRFQID = RFQID;
    }

    GetRFQID(): number {
        return this.CurrentRFQID;
    }

    SetPONumber(PONumber: string): void {
        this.CurrentPONumber = PONumber;
    }

    GetPONumber(): string {
        return this.CurrentPONumber;
    }

   

}
