import { Guid } from 'guid-typescript';

export class PurchaseRequisition {
    PurchaseRequisitionID: number;
    // PurchaseRequirement: string;
    PurchaseDate: Date;
    PurchaseOrganization: string;
    PurchaseGroup: string;
    CompanyCode: string;
    Buyer: string;
    State: string;
    Publishing: string;
    Response: string;
    Awarded: string;
    RFQStatus: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}

export class PurchaseRequisitionItem {
    PurchaseRequisitionID: number;
    ItemID: number;
    MaterialCode: string;
    MaterialDescription: string;
    OrderQuantity: number;
    UOM: string;
    ExpectedDeliveryDate?: Date;
    DelayDays: number;
    Schedule: number;
    Price: number;
    SupplierPartNumber: string;
    SelfLifeDays: number;
    NumberOfAttachments: number;
    QuestionerID: string;
    TechRating: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}

export class RFQHeader {
    RFQID: number;
    Title: string;
    SupplyPlant: string;
    Currency: string;
    RFQStartDate: Date;
    RFQResponseStartDate?: Date;
    IncoTerm: string;
    RFQEndDate?: Date;
    RFQResponseEndDate?: Date;
    Status: string;
    AutoEvaluation: string;
    RFQType: string;
    AwardedVendor: string;
    Rank2Vendor: string;
    Rank3Vendor: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}

export class RFQHeaderView {
    RFQID: number;
    Title: string;
    SupplyPlant: string;
    Currency: string;
    RFQStartDate: Date;
    RFQResponseStartDate?: Date;
    IncoTerm: string;
    RFQEndDate?: Date;
    RFQResponseEndDate?: Date;
    Status: string;
    CreatedOn: Date;
    CreatedBy: string;
    Buyer: string;
    IsActive: boolean;
}

export class RFQResponseReceivedView {
    RFQID: number;
    VendorID: string;
    VendorName: string;
    TotalPrice: number;
}

export class RFQHeaderVendorView {
    RFQID: number;
    VendorID: string;
    Title: string;
    SupplyPlant: string;
    Currency: string;
    RFQStartDate: Date;
    RFQResponseStartDate?: Date;
    IncoTerm: string;
    RFQEndDate?: Date;
    RFQResponseEndDate?: Date;
    Status: string;
    RFQResponseStatus: string;
    IsActive: boolean;
}
export class RFQItem {
    RFQID: number;
    ItemID: number;
    MaterialCode: string;
    MaterialDescription: string;
    OrderQuantity: number;
    UOM: string;
    ExpectedDeliveryDate?: Date;
    DelayDays: number;
    Schedule: number;
    Price: number;
    SupplierPartNumber: string;
    SelfLifeDays: number;
    NumberOfAttachments: number;
    QuestionerID: string;
    TechRating: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}
export class RFQView {
    PurchaseRequisitionID: number;
    RFQID: number;
    Title: string;
    SupplyPlant: string;
    Currency: string;
    RFQStartDate: Date;
    RFQResponseStartDate?: Date;
    IncoTerm: string;
    RFQEndDate?: Date;
    RFQResponseEndDate?: Date;
    Status: string;
    RFQItems: RFQItemView[];
    // AutoEvaluation: string;
    // RFQType: string;
    // AwardedVendor: string;
    // Rank2Vendor: string;
    // Rank3Vendor: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}
export class RFQWithResponseView {
    RFQID: number;
    VendorID: string;
    Title: string;
    SupplyPlant: string;
    Currency: string;
    RFQStartDate: Date;
    RFQResponseStartDate?: Date;
    IncoTerm: string;
    RFQEndDate?: Date;
    RFQResponseEndDate?: Date;
    Status: string;
    RFQResponseStatus: string;
    RFQResponseItems: RFQResponseItemView[];
    IsActive: boolean;
}
export class RFQItemView {
    RFQID: number;
    ItemID: number;
    MaterialCode: string;
    MaterialDescription: string;
    OrderQuantity: number;
    UOM: string;
    ExpectedDeliveryDate?: Date;
    DelayDays: number;
    Schedule: number;
    Price: number;
    SupplierPartNumber: string;
    SelfLifeDays: string;
    NumberOfAttachments: number;
    AttachmentNames: string[];
    TechRating: string;
    APPID: number;
}

export class PurchaseRequisitionView {
    PurchaseRequisitionID: number;
    RFQID: number;
    RFQStatus: string;
}

export class RFQAllocation {
    RFQID: number;
    VendorID: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class RFQAllocationView {
    PurchaseRequisitionID: number;
    RFQID: number;
    VendorID: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}


export class RFQResponseHeader {
    RFQID: number;
    VendorID: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class RFQResponseItem {
    RFQID: number;
    VendorID: string;
    ItemID: number;
    MaterialCode: string;
    MaterialDescription: string;
    OrderQuantity: number;
    UOM: string;
    DeliveryDate?: Date;
    DelayDays: number;
    Schedule: number;
    Price: number;
    SupplierPartNumber: string;
    SelfLifeDays: number;
    NumberOfAttachments: number;
    TechRating: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class RFQResponseView {
    PurchaseRequisitionID: number;
    RFQID: number;
    VendorID: string;
    UserID: Guid;
    RFQResponseItems: RFQResponseItemView[];
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class RFQResponseItemView {
    RFQID: number;
    VendorID: string;
    ItemID: number;
    MaterialCode: string;
    MaterialDescription: string;
    OrderQuantity: number;
    UOM: string;
    ExpectedDeliveryDate?: Date;
    DeliveryDate?: Date;
    DelayDays: number;
    Schedule: number;
    Price: number;
    SupplierPartNumber: string;
    SelfLifeDays: string;
    NumberOfAttachments: number;
    AttachmentNames: string[];
    TechRating: string;
    APPID: number;
}

