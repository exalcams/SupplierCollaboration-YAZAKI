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
    ShipFrom: string;
    Vendor: string;
    Item: string;
    Name: string;
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
    UnitOfMeasure: string;
    BatchNumber: string;
    Plant: string;
    Vendor: string;
    Currency: string;
    Details: string;
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
    GrossWeight: string;
    Volume: string;
    VolumeUnitOfMeasure: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}

export class VendorLocation {
    Vendor: string;
    Item: string;
    Name: string;
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

export class ASNHeaderView{
    TransID: number;
    ASN_Header_PO: string;
    Status: string;
    NoOfPackages: number;
    NotificationDate: Date;
}
