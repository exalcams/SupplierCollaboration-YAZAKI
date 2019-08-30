export class POView {
    PO: string;
    Item: string;
    PODate: Date;
    Material: string;
    MaterialDescription: string;
    OrderedQuantity: number;
    UnitOfMeasure: string;
    AcknowledgementStatus: string;
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
    OpDate: Date;
    DeliveryDate: Date;
    LastShipmentDate: Date;
    isDeleted: boolean;
    isForeClosed: boolean;
    Currency: string;
    IsActive: string;
}
export class PO_OrderLookUpDetails {
    PO_ScheduleDetails: PO_ScheduleDetails[];
    PO_AdvanceShipmentNotification: PO_AdvanceShipmentNotification[];
    PO_GRN: PO_GRN[];
}
export class PO_ScheduleDetails {
    Item: string;
    Description: string;
    ScheduleLine: string;
    DaliveryDate: Date;
    ScheduleQuantity: number;
    UOM: string;
}
export class PO_AdvanceShipmentNotification {
    Item: string;
    Description: string;
    ShipmentId: string;
    Material: string;
    ASNStatus: string;
    ShipmentQuantity: number;
    UOM: string;
    CargoType: string;
}
export class PO_GRN {
    Item: string;
    Description: string;
    Material: string;
    MaterialDocument: string;
    Status: string;
    UOM: string;
    PostingDate: Date;
    DeliveredQuantity: number;
    RejectQuantity: number;
}
export class Acknowledgement {
    TransID: number;
    Acknowledgement_PO: string;
    Item: string;
    ScheduleLine: string;
    Status: string;
    OrderedQuantity: string;
    AcknowledgedQuantity: string;
    OrderedDeliveryDate: string;
    AcknowledgedDeliveryDate: string;
    Created_On: Date;
    Approved_By: string;
    Approved_On: Date;
    Created_By: string;
    IsActive: boolean;
}
export class PO_ScheduleLine {
    PO_ScheduleLine_PO: string;
    Item: string;
    ScheduleLine: string;
    Material: string;
    OrderedQuantity: number;
    MaterialText: string;
    UnitofMeasure: string;
    OpDate: Date;
    DeliveryDate: Date;
    LastShipmentDate: Date;
    isDeleted: boolean;
    isForeClosed: boolean;
    Currency: string;
    IsActive: string;
}
export class PO_OrderAcknowledgement {
    PO: string;
    Item: string;
    CompanyCode: string;
    PODate: Date;
    PlantGST: string;
    PaymentTerms: string;
    Currency: string;
    Buyer: string;
    BuyerPhNo: string;
    Status: string;
    Remarks: string;
    //  POItemList: PO_Item[];
    AcknowledgementDetails: Acknowledgement[];
    POOrderScheduleDetails: PO_ScheduleLine[];
    POOrderScheduleLine: POOrderScheduleLine[];
}
export class POOrderScheduleLine {
    TransID: number;
    PO: string;
    Item: string;
    ScheduleLine: string;
    Material: string;
    MaterialDescription: string;
    DeliveryDate: Date;
    AcceptedDate: Date;
    OrderQuantity: string;
    AcceptedQuantity: string;
    UOM: string;
    NetPrice: string;
    Status: string;
    Created_On: Date;
    Approved_On: Date;
    Approved_By: string;
    Created_By: string;
    IsActive: string;
}
