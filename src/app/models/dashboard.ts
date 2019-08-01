export class POList {

    PurchaseOrder: string;
    Item: string;
    PODate: Date;
    Material: string;
    Description: string;
    POQuantity: number;
    OrderUnit: string;
    QAStatus: string;
    ASNStatus: string;
    Attechment: string;
    Select: boolean;
}
export class PO_Notifications {
    TotalPODocument: number;
    OpenPODocument: number;
    InTransit: number;
    ASNPending: number;
}
export class DashboardStatus {
    PO: number;
    FromDays: number;
    ShipOpen: number;
    ShipWeek: number;
    InTransit: number;
    TransitReceived: number;
    PaymentDue: number;
    PaymentReceived: number;
}
export class PO_DeliveryStatus {
    Date: Date[];
    Count: number[];
    ExpDateOfArrivalCount: number[];
}
export class PO_PurchaseOrderDetails {
    PoOrganization: string;
    Vendor: string;
    PODate: Date;
    CompanyCode: string;
    Plant: string;
    Buyer: string;
    POItemList: PO_Item[];
}
export class PO_Item {
    PO_Item_PO: string;
    Item: string;
    Material: string;
    OrderedQuantity: number;
    MaterialText: string;
    UnitofMeasure: string;
    OpDate: number;
    DeliveryDate: Date;
    LastShipmentDate: Date;
    isDeleted: boolean;
    isForeClosed: boolean;
    Currency: string;
    IsActive: string;
}