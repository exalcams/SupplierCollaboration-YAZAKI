import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { AuthService } from 'app/services/auth.service';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';
import { UserWithRole, RoleWithMenuApp, AuthenticationDetails, VendorView } from 'app/models/master';

@Component({
  selector: 'user-main-content',
  templateUrl: './user-main-content.component.html',
  styleUrls: ['./user-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserMainContentComponent implements OnInit, OnChanges {

  @Input() currentSelectedUser: UserWithRole = new UserWithRole();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  user: UserWithRole;
  userMainFormGroup: FormGroup;
  AllRoles: RoleWithMenuApp[] = [];
  AllVendors: VendorView[] = [];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  baseAddress: string;
  authenticationDetails: AuthenticationDetails;
  isVendor: boolean;
  constructor(private _masterService: MasterService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _authService: AuthService) {
    this.userMainFormGroup = this._formBuilder.group({
      userName: ['', Validators.required],
      roleID: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern]],
      vendorCode: [''],
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.user = new UserWithRole();
    this.authenticationDetails = new AuthenticationDetails();
    this.baseAddress = _authService.baseAddress;
    this.isVendor = false;
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetAllRoles();
    this.GetAllVendors();
  }
  GetAllRoles(): void {
    this._masterService.GetAllRoles().subscribe(
      (data) => {
        this.AllRoles = <RoleWithMenuApp[]>data;
        if (this.user && this.user.RoleID) {
          this.CheckIsVendor(this.user.RoleID);
        }
        // console.log(this.AllMenuApps);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  GetAllVendors(): void {
    this._masterService.GetAllVendorViews().subscribe(
      (data) => {
        this.AllVendors = <VendorView[]>data;
      },
      (err) => {
        console.log(err);
      }
    );
  }



  ResetControl(): void {
    this.user = new UserWithRole();
    this.userMainFormGroup.reset();
    Object.keys(this.userMainFormGroup.controls).forEach(key => {
      // const control = this.userMainFormGroup.get(key);
      this.userMainFormGroup.get(key).markAsUntouched();
    });
    this.isVendor = false;
  }

  roleSelectionChange(event): void {
    this.CheckIsVendor(event.value);
  }

  CheckIsVendor(val: any): void {
    if (this.AllRoles) {
      const SR: RoleWithMenuApp = this.AllRoles.filter(x => x.RoleID === val)[0];
      if (SR) {
        if (SR.RoleName.toLocaleLowerCase() === 'vendor') {
          this.isVendor = true;
          this.userMainFormGroup.get('vendorCode').setValidators(Validators.required);
          this.userMainFormGroup.get('vendorCode').updateValueAndValidity();
        } else {
          this.isVendor = false;
          this.userMainFormGroup.get('vendorCode').clearValidators();
          this.userMainFormGroup.get('vendorCode').updateValueAndValidity();
        }
      }
    }
  }

  SaveClicked(): void {
    if (this.userMainFormGroup.valid) {
      if (this.user.UserID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'User'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.user.UserName = this.userMainFormGroup.get('userName').value;
              this.user.RoleID = <Guid>this.userMainFormGroup.get('roleID').value;
              this.user.Email = this.userMainFormGroup.get('email').value;
              this.user.ContactNumber = this.userMainFormGroup.get('contactNumber').value;
              this.user.VendorCode = this.userMainFormGroup.get('vendorCode').value;
              this.user.ModifiedBy = this.authenticationDetails.userID.toString();
              this._masterService.UpdateUser(this.user).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('User updated successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this._masterService.TriggerNotification('User updated successfully');
                },
                (err) => {
                  console.error(err);
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  this.ShowProgressBarEvent.emit('hide');
                }
              );
            }
          }
        );

      } else {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Create',
            Catagory: 'User'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.user = new UserWithRole();
              this.user.UserName = this.userMainFormGroup.get('userName').value;
              this.user.RoleID = this.userMainFormGroup.get('roleID').value;
              this.user.Email = this.userMainFormGroup.get('email').value;
              this.user.ContactNumber = this.userMainFormGroup.get('contactNumber').value;
              this.user.VendorCode = this.userMainFormGroup.get('vendorCode').value;
              this.user.CreatedBy = this.authenticationDetails.userID.toString();
              // this.user.Profile = this.slectedProfile;
              this._masterService.CreateUser(this.user).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('User created successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this._masterService.TriggerNotification('User created successfully');
                },
                (err) => {
                  console.error(err);
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  this.ShowProgressBarEvent.emit('hide');
                }
              );
            }
          });
      }
    } else {
      Object.keys(this.userMainFormGroup.controls).forEach(key => {
        this.userMainFormGroup.get(key).markAsTouched();
        this.userMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  DeleteClicked(): void {
    if (this.userMainFormGroup.valid) {
      if (this.user.UserID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'User'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.user.UserName = this.userMainFormGroup.get('userName').value;
              this.user.RoleID = <Guid>this.userMainFormGroup.get('roleID').value;
              this.user.Email = this.userMainFormGroup.get('email').value;
              this.user.ContactNumber = this.userMainFormGroup.get('contactNumber').value;
              this.user.VendorCode = this.userMainFormGroup.get('vendorCode').value;
              this.user.ModifiedBy = this.authenticationDetails.userID.toString();
              this._masterService.DeleteUser(this.user).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('User deleted successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this._masterService.TriggerNotification('User deleted successfully');
                },
                (err) => {
                  console.error(err);
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  this.ShowProgressBarEvent.emit('hide');
                }
              );
            }
          });
      }
    } else {
      Object.keys(this.userMainFormGroup.controls).forEach(key => {
        this.userMainFormGroup.get(key).markAsTouched();
        this.userMainFormGroup.get(key).markAsDirty();
      });
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    this.user = this.currentSelectedUser;
    if (this.user) {
      this.userMainFormGroup.get('userName').patchValue(this.user.UserName);
      this.userMainFormGroup.get('roleID').patchValue(this.user.RoleID);
      this.CheckIsVendor(this.user.RoleID);
      this.userMainFormGroup.get('email').patchValue(this.user.Email);
      this.userMainFormGroup.get('contactNumber').patchValue(this.user.ContactNumber);
      this.userMainFormGroup.get('vendorCode').patchValue(this.user.VendorCode);
    } else {
      // this.menuAppMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }
}






export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const confirmPassword = control.parent.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (confirmPassword.value === '') {
    return null;
  }

  if (password.value === confirmPassword.value) {
    return null;
  }

  return { 'passwordsNotMatching': true };
};





