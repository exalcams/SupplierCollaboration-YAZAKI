export class STCategory {
    ID: number;
    Category: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class STReson {
    ID: number;
    Reson: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class STExpectedResult {
    ID: number;
    ExpectedResult: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class SupportTicket {
    TicketID: number;
    Category: string;
    ReferenceNumber: string;
    Reason: string;
    ExpectedResult: string;
    Query: string;
    SupportTicketStatus: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class SupportTicketUserMap {
    ID: number;
    TicketID: number;
    Email: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class SupportTicketResponse {
    ID: number;
    TicketID: number;
    Comments: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class SupportTicketWithEmails {
    TicketID: number;
    Category: string;
    ReferenceNumber: string;
    Reason: string;
    ExpectedResult: string;
    Query: string;
    SupportTicketStatus: string;
    EmailAddresses: string[];
    SupportTicketAttachments: string[];
    CreatedOn: Date;
    CreatedBy: string;
    CreatedByUser: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    ModifiedByUser: string;
}
export class SupportTicketResponseView {
    ID: number;
    TicketID: number;
    Comments: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    CreatedByUser: string;
}
export class SupportTicketStatusView {
    TicketID: number;
    SupportTicketStatus: string;
    Reason: string;
    ModifiedBy: string;
}
export class SupportTicketConfirmationStatusView {
    Actiontype: string;
    Reason: string;
}
export class STCategoryView {
    ID: number;
    Category: string;
}
export class STReasonView {
    ID: number;
    Reason: string;
}
export class STExpectedResultView {
    ID: number;
    ExpectedResult: string;
}
