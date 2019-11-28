import { Guid } from 'guid-typescript';
import { AwardedDetailsComponent } from 'app/allModules/rfq/awarded-details/awarded-details.component';

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
    TechRating: number;
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
    CreatedOn: Date;
    CreatedBy: string;
    Buyer: string;
    IsActive: boolean;
}

export class RFQResponseReceivedView {
    RFQID: number;
    VendorID: string;
    VendorName: string;
    EmailId: string;
    GSTNumber: string;
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
    CreatedBy: string;
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
    TechRating: number;
    Notes: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    IsActive: boolean;
}
export class PriorityParameter {
    ID: number;
    Parameter: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class RFQParameterPriority {
    RFQID: number;
    Parameter: string;
    Priority: number;
    PriorityValue: number;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
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
    ContactNumber: string;
    BankGuarantee: boolean;
    Status: string;
    RFQItems: RFQItemView[];
    CurrentRFQParameterPriorities: RFQParameterPriority[];
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
    ContactNumber: string;
    BankGuarantee: boolean;
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
    SelfLifeDays: number;
    NumberOfAttachments: number;
    AttachmentNames: string[];
    TechRating: number;
    Notes: string;
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
    ContactNumber: string;
    BankGuarantee: boolean;
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
    Manufacturer: string;
    OrderQuantity: number;
    UOM: string;
    DeliveryDate?: Date;
    DelayDays: number;
    Schedule: number;
    Price: number;
    PaymentTerms: string;
    SupplierPartNumber: string;
    SelfLifeDays: number;
    NumberOfAttachments: number;
    TechRating: number;
    Notes: string;
    IsResponded: boolean;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class RFQResponseTechRating {
    RFQID: number;
    VendorID: string;
    ItemID: number;
    TechRating: number;
    Comment: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class RFQResponseTechRatingView {
    RFQID: number;
    VendorID: string;
    ItemID: number;
    TechRating: number;
    Comment: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    CreatedByUser: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class RFQResponseView {
    PurchaseRequisitionID: number;
    RFQID: number;
    VendorID: string;
    ContactNumber: string;
    BankGuarantee: boolean;
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
    Manufacturer: string;
    OrderQuantity: number;
    UOM: string;
    ExpectedDeliveryDate?: Date;
    DeliveryDate?: Date;
    DelayDays: number;
    Schedule: number;
    Price: number;
    PaymentTerms: string;
    SupplierPartNumber: string;
    SelfLifeDays: number;
    NumberOfAttachments: number;
    AttachmentNames: string[];
    TechRating: number;
    Notes: string;
    IsResponded: boolean;
    APPID: number;
}

export class RFQRankView {
    RFQID: number;
    VendorID: string;
    VendorName: string;
    ItemID: number;
    MaterialCode: string;
    MaterialDescription: string;
    OrderQuantity: number;
    UOM: string;
    DelayDays: number;
    Schedule: number;
    Price: number;
    SelfLifeDays: number;
    TotalRank: number;
    BestForItems: string;
    TechRating: number;
}

export class RFQAwardVendorView {
    RFQID: number;
    VendorID: string;
    ModifiedBy: string;
}

export class RFQEvaluationView {
    PurchaseRequisitionID: number;
    RFQID: number;
    Title: string;
    Status: string;
    Buyer: string;
}

export class PurchaseRequisitionStatusCount {
    All: number;
    YetToConvert: number;
    InProgress: number;
    Allocated: number;
    Responded: number;
    Awarded: number;
}

export class RFQStatusCount {
    All: number;
    ResponsePending: number;
    Responded: number;
    EvaluationPending: number;
    Awarded: number;
}

export class RFQVendorRank {
    RFQID: number;
    Parameter: string;
    VendorID1: string;
    VendorName1: string;
    VendorValue1: number;
    VendorID2: string;
    VendorName2: string;
    VendorValue2: number;
    VendorID3: string;
    VendorName3: string;
    VendorValue3: number;
}

