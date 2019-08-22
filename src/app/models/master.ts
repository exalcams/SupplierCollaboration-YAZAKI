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
    GSTNumber: string;
    State: string;
    City: string;
    Plant: string;
    Type: string;
    IsActive: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class VendorSearchCondition {
    VendorCode: string;
    VendorName: string;
    GSTNumber: string;
    State: string;
    Type: string;
}


