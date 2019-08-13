export interface IPaymentReportPO {
    PaymentDoc: string;
    PaymentDate: Date;
    PO: string;
    PODate: Date;
    InvoiceReference: string;
    ClearingDoc: string;
    ClearingDate: Date;
    PaymentAdviceNo: string;
    PaymentAdviceAmount: string;
    Amount: string;
    Currency: string;
}
