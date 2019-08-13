import { IGateEntryHeader, IGatePassInfo } from './gateEntry.model';
import { Guid } from 'guid-typescript';

export interface IGateEntryHeader {
    GT_NO?: string;
    UserID: Guid;
    RegisterType: string;
    ReferenceType: string;
    TransportMode: string;
    VehiceNo: string;
    Vendor: string;
    Driver: string;
    DrivingLicense: string;
    GateIn: string;
    GateInUser: string;
    GateInDate: Date;
    Plant: string;
    GateExit: string;
    GateExitDate: Date;
    GateExitUser: string;
    CreatedDate: Date;
    ModifiedDate: Date;
    ChallanNo: string;
    ChallanDate: Date;
    ReportingDate: Date;
    IsCancelled: boolean;
    Remarks: string;
    ReferenceNo: string;
    TareWeight: number;
    GrossWeight: number;
    NetWeight: number;
}

export interface IGatePassInfo {
    GT_NO?: string;
    USERID?: Guid;
    PO: string;
    ASN_ID?: string;
    Item: number;
    ChallanNo?: string;
    ChallanDate?: Date;
    Qty: number;
    Material: string;
    Description: string;
    NonReturnable?: boolean;
    Plant?: string;
    LineItemID?: number;
    OpenRNR?: number;
    LastQty?: number;
    PrevQty?: number;
    IsCancelled?: boolean;
    UoM: string;
    CreatedDate?: Date;
    ModifiedDate?: Date;
}

export interface IGatePassModel extends IGateEntryHeader {
    GatePassItem: IGatePassInfo[];
}

export interface IGatePassNoData {
    GT_No: string;
    ReferenceType: string;
    Vendor: string;
    CreatedDate: Date;
}
