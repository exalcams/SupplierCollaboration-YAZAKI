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
