import { Guid } from 'guid-typescript';

export class UserWithRole {
    UserID: Guid;
    RoleID: Guid;
    UserName: string;
    VendorCode: string;
    Email: string;
    Password: string;
    ContactNumber: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class RoleWithMenuApp {
    RoleID: Guid;
    RoleName: string;
    MenuAppIDList: number[];
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class MenuApp {
    MenuAppID: number;
    MenuAppName: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class App {
    AppID: number;
    AppName: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class AuthenticationDetails {
    isAuth: boolean;
    userID: Guid;
    userName: string;
    displayName: string;
    emailAddress: string;
    userRole: string;
    // vendorCode: string;
    menuItemNames: string;
    // profile: string;
    refreahToken: string;
    expires: string;
    issued: string;
    expiresin: string;
}
export class ChangePassword {
    UserID: Guid;
    UserName: string;
    CurrentPassword: string;
    NewPassword: string;
}
export class EMailModel {
    EmailAddress: string;
    siteURL: string;
}
export class ForgotPassword {
    UserID: Guid;
    EmailAddress: string;
    NewPassword: string;
    Token: string;
}
export class UserNotification {
    ID: number;
    UserID: string;
    Message: string;
    HasSeen: boolean;
    CreatedOn: Date;
    ModifiedOn?: Date;
}
export class UserPreference {
    ID: number;
    UserID: Guid;
    NavbarPrimaryBackground: string;
    NavbarSecondaryBackground: string;
    ToolbarBackground: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class Vendor {
    ID: number;
    VendorCode: string;
    VendorName: string;
    EmailId: string;
    ContactNumber: string;
    GSTNumber: string;
    State: string;
    City: string;
    AccountGroup: string;
    Plant: string;
    Type: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class VendorView {
    ID: number;
    VendorCode: string;
    VendorName: string;
}
export class VendorSearchCondition {
    VendorCode: string;
    VendorName: string;
    GSTNumber: string;
    State: string;
    City: string;
    AccountGroup: string;
}

export class CurrencyMaster {
    ID: number;
    CurrencyCode: string;
    Description: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class CurrencyMasterView {
    ID: number;
    CurrencyCode: string;
    Description: string;
}
export class IncoTermMaster {
    ID: number;
    IncoTermCode: string;
    Description: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class IncoTermMasterView {
    ID: number;
    IncoTermCode: string;
    Description: string;
}
export class PlantMaster {
    ID: number;
    Plant: string;
    Name: string;
    Name2: string;
    StreetAndHouseNumber: string;
    Address: string;
    PostalCode: string;
    Area: string;
    City: string;
    State: string;
    CountryKey: string;
    PurchaseOrganization: string;
    SalesOrganization: string;
    DistributionChannel: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class PlantMasterView {
    ID: number;
    Plant: string;
    Name: string;
    Area: string;
    City: string;
    State: string;
    CountryKey: string;
}



