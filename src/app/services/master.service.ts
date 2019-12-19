import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { MenuApp, RoleWithMenuApp, UserWithRole, UserNotification, UserPreference, App, Vendor, VendorSearchCondition, VendorView, CurrencyMaster, CurrencyMasterView, IncoTermMaster, IncoTermMasterView, PlantMaster, PlantMasterView } from 'app/models/master';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  baseAddress: string;
  NotificationEvent: Subject<any>;

  GetNotification(): Observable<any> {
    return this.NotificationEvent.asObservable();
  }

  TriggerNotification(eventName: string): void {
    this.NotificationEvent.next(eventName);
  }

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
    this.NotificationEvent = new Subject();
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  // MenuApp
  CreateMenuApp(menuApp: MenuApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateMenuApp`,
      menuApp,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllMenuApps(): Observable<MenuApp[] | string> {
    return this._httpClient.get<MenuApp[]>(`${this.baseAddress}api/Master/GetAllMenuApps`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateMenuApp(menuApp: MenuApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateMenuApp`,
      menuApp,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteMenuApp(menuApp: MenuApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteMenuApp`,
      menuApp,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // App
  CreateApp(app: App): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateApp`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllApps(): Observable<App[] | string> {
    return this._httpClient.get<App[]>(`${this.baseAddress}api/Master/GetAllApps`)
      .pipe(catchError(this.errorHandler));
  }

  GetAppByName(Name: string): Observable<App | string> {
    return this._httpClient.get<App>(`${this.baseAddress}api/Master/GetAppByName?Name=${Name}`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateApp(app: App): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateApp`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteApp(app: App): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteApp`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // Vendor
  CreateVendor(vendor: Vendor): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateVendor`,
      vendor,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllVendors(): Observable<Vendor[] | string> {
    return this._httpClient.get<Vendor[]>(`${this.baseAddress}api/Master/GetAllVendors`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllVendorViews(): Observable<VendorView[] | string> {
    return this._httpClient.get<VendorView[]>(`${this.baseAddress}api/Master/GetAllVendorViews`)
      .pipe(catchError(this.errorHandler));
  }

  GetVendorsByVendorCodes(VendorCodes: string[]): Observable<Vendor[] | string> {
    return this._httpClient.post<Vendor[]>(`${this.baseAddress}api/Master/GetVendorsByVendorCodes`,
      VendorCodes,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  UpdateVendor(vendor: Vendor): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateVendor`,
      vendor,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteVendor(vendor: Vendor): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteVendor`,
      vendor,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
  GetVendorsBasedOnConditions(vendorSearchCondition: VendorSearchCondition): Observable<Vendor[] | string> {
    return this._httpClient.post<Vendor[]>(`${this.baseAddress}api/Master/GetVendorsBasedOnConditions`,
      vendorSearchCondition,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetVendorsBasedOnMaterial(RFQID: number): Observable<Vendor[] | string> {
    return this._httpClient.get<Vendor[]>(`${this.baseAddress}api/Master/GetVendorsBasedOnMaterial?RFQID=${RFQID}`)
      .pipe(catchError(this.errorHandler));
  }

  // Role
  CreateRole(role: RoleWithMenuApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateRole`,
      role,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllRoles(): Observable<RoleWithMenuApp[] | string> {
    return this._httpClient.get<RoleWithMenuApp[]>(`${this.baseAddress}api/Master/GetAllRoles`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateRole(role: RoleWithMenuApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateRole`,
      role,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteRole(role: RoleWithMenuApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteRole`,
      role,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // Users

  CreateUser1(user: UserWithRole, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('uploadFile', file, file.name);
    formData.append('userName', user.UserName);

    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateUser1`,
      formData,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    )
      .pipe(catchError(this.errorHandler));
  }

  CreateUser(user: UserWithRole): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateUser`,
      user,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));

  }

  GetAllUsers(): Observable<UserWithRole[] | string> {
    return this._httpClient.get<UserWithRole[]>(`${this.baseAddress}api/Master/GetAllUsers`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateUser(user: UserWithRole): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateUser`,
      user,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));

  }

  DeleteUser(user: UserWithRole): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteUser`,
      user,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // UserPreference

  CreateUserPreference(role: UserPreference): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateUserPreference`,
      role,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  GetAllUserPreferences(): Observable<UserPreference[] | string> {
    return this._httpClient.get<UserPreference[]>(`${this.baseAddress}api/Master/GetAllUserPrefercences`)
      .pipe(catchError(this.errorHandler));
  }
  GetUserPreferenceByUserID(UserID: Guid): Observable<UserPreference | string> {
    return this._httpClient.get<UserPreference>(`${this.baseAddress}api/Master/GetUserPreferenceByUserID?UserID=${UserID}`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateUserPreference(role: UserPreference): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateUserPreference`,
      role,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteUserPreference(role: UserPreference): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteUserPreference`,
      role,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllNotificationByUserID(UserID: string): Observable<UserNotification[] | string> {
    return this._httpClient.get<UserNotification[]>(`${this.baseAddress}api/Notification/GetAllNotificationByUserID?UserID=${UserID}`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateNotification(SelectedNotification: UserNotification): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Notification/UpdateNotification`,
      SelectedNotification, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.errorHandler));
  }

  // CurrencyMaster
  CreateCurrencyMaster(app: CurrencyMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateCurrencyMaster`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllCurrencyMasters(): Observable<CurrencyMasterView[] | string> {
    return this._httpClient.get<CurrencyMasterView[]>(`${this.baseAddress}api/Master/GetAllCurrencyMasters`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateCurrencyMaster(app: CurrencyMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateCurrencyMaster`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteCurrencyMaster(app: CurrencyMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteCurrencyMaster`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // IncoTermMaster
  CreateIncoTermMaster(app: IncoTermMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateIncoTermMaster`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllIncoTermMasters(): Observable<IncoTermMasterView[] | string> {
    return this._httpClient.get<IncoTermMasterView[]>(`${this.baseAddress}api/Master/GetAllIncoTermMasters`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateIncoTermMaster(app: IncoTermMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateIncoTermMaster`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteIncoTermMaster(app: IncoTermMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteIncoTermMaster`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // PlantMaster
  CreatePlantMaster(app: PlantMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreatePlantMaster`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllPlantMasters(): Observable<PlantMasterView[] | string> {
    return this._httpClient.get<PlantMasterView[]>(`${this.baseAddress}api/Master/GetAllPlantMasters`)
      .pipe(catchError(this.errorHandler));
  }

  UpdatePlantMaster(app: PlantMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdatePlantMaster`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeletePlantMaster(app: PlantMaster): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeletePlantMaster`,
      app,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

}
