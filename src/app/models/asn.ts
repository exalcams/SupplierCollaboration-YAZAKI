export class ASN {
    TransID: number;
    ASN_Header_PO: string;
    Status: string;
    NoOfPackages: number;
    NotificationDate: Date;
    NetWeight: number;
    GrossWeight: number;
    GrossWeightUOM: string;
    DispatchLocation: string;
    Volume: string;
    VolumeUOM: string;
    ModeOfTransport: string;
    GargoType: string;
    GargoDescription: string;
    MaterialDescription: string;
    Remarks: string;
    // ShipFrom: string;
    Vendor: string;
    Name1: string;
    Name2: string;
    Street: string;
    City: string;
    PINCode: number;
    Region: string;
    Country: string;
    ASNItems: ASNItem[];
    ASNPackageDetails: ASNPackageDetail[];
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}
export class ASNItem {
    TransID: number;
    Item: string;
    MaterialDescription: string;
    OrderedQuantity: number;
    UOM: string;
    ApprovedQuantity: number;
    InProcessQuantity: number;
    OfferedQuantity: number;
    PackageID: string;
    BatchNumber: string;
    Remarks: string;
    // Plant: string;
    // Vendor: string;
    // Currency: string;
    // Details: string;
    Number: string;
    ItemDate: Date;
    DepatureDate?: Date;
    ExpDateOfArrival?: Date;
    ChallanNumber: string;
    ChallanDate?: Date;
    TransporterName: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}
export class ASNPackageDetail {
    TransID: number;
    Item: string;
    PackageID: string;
    PackageType: string;
    ReferenceNumber: string;
    Dimension: string;
    GrossWeight: number;
    Volume: string;
    NetWeight: number;
    VolumeUOM: string;
    GrossWeightUOM: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}

export class VendorLocation {
    Vendor: string;
    Name1: string;
    Name2: string;
    Street: string;
    City: string;
    PINCode: number;
    Region: string;
    Country: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}

export class POView {
    PO: string;
    PODate: Date;
    Item: string;
    OrderedQuantity: number;
    UnitOfMeasure: string;
    Material: string;
    MaterialDescription: string;
    AcknowledgementStatus: string;
    ASNStatus: string;
}
export class ASNHeaderView {
    TransID: number;
    ASN_Header_PO: string;
    Status: string;
    NoOfPackages: number;
    NotificationDate: Date;
}

export class Auxiliary {
    APPID: number;
    APPNumber: number;
    AttachmentNumber: number;
    AttachmentName: string;
    DocumentType: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}
