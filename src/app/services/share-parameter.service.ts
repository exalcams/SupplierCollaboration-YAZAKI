import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { PurchaseRequisitionView } from 'app/models/rfq.model';

@Injectable({
    providedIn: 'root'
})
export class ShareParameterService {
    // private PurchaseRequisitionEvent = new Subject<any>();
    public CurrentPurchaseRequisition: PurchaseRequisitionView;
    // constructor() {
    //     this.PurchaseRequisitionEvent = new Subject(null);
    // }
    GetPurchaseRequisition(): PurchaseRequisitionView {
        return this.CurrentPurchaseRequisition;
    }

    SetPurchaseRequisition(PurchaseRequisition: PurchaseRequisitionView): void {
        this.CurrentPurchaseRequisition = PurchaseRequisition;
    }

    
}
