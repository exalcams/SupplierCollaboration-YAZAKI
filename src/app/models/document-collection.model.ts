export class CAPAHeader {
    CAPAID: number;
    Title: string;
    LongText: string;
    DueDate: Date;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class CAPAAllocation {
    CAPAID: number;
    VendorID: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class CAPAHeaderView {
    CAPAID: string;
    Title: string;
    LongText: string;
    DueDate: Date;
    CAPAStatus: string;
    CreatedOn: Date;
    CreatedBy: string;
    OwnerName: string;
}

export class CAPAAllocationVendorView {
    CAPAID: number;
    VendorID: string;
    VendorName: string;
}

export class CAPAResponse {
    CAPAResponseID: string;
    CAPAID: number;
    Comments: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
}

export class CAPAResponseView {
    CAPAResponseID: string;
    CAPAID: number;
    Comments: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    CreatedByUser: string;
}

export class CAPAStatusView {
    CAPAID: number;
    CAPAStatus: string;
    Reason: string;
    ModifiedBy: string;
}

export class CAPAConfirmationStatusView {
    ActionType: string;
    Reason: string;
}
