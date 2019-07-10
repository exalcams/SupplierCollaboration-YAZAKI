import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';
import { RoleWithApp, MenuApp, AuthenticationDetails } from 'app/models/master';

@Component({
  selector: 'role-main-content',
  templateUrl: './role-main-content.component.html',
  styleUrls: ['./role-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RoleMainContentComponent implements OnInit, OnChanges {
  @Input() currentSelectedRole: RoleWithApp = new RoleWithApp();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  role: RoleWithApp;
  roleMainFormGroup: FormGroup;
  AllMenuApps: MenuApp[] = [];
  AppIDListAllID: number;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  constructor(
    private _masterService: MasterService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog) {
    this.roleMainFormGroup = this._formBuilder.group({
      roleName: ['', Validators.required],
      appIDList: [[], Validators.required]
      // appIDList: [[], CustomValidators.SelectedRole('Administrator')]
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.AppIDListAllID = 0;
    this.role = new RoleWithApp();
    this.authenticationDetails = new AuthenticationDetails();
  }

  GetAllMenuApps(): void {
    this._masterService.GetAllMenuApp().subscribe(
      (data) => {
        this.AllMenuApps = <MenuApp[]>data;
        if (this.AllMenuApps && this.AllMenuApps.length > 0) {
          const xy = this.AllMenuApps.filter(x => x.AppName === 'All')[0];
          if (xy) {
            this.AppIDListAllID = xy.AppID;
          }
        }
        // console.log(this.AllMenuApps);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('Role') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetAllMenuApps();
    this.ResetControl();
  }
  ResetControl(): void {
    this.role = new RoleWithApp();
    this.roleMainFormGroup.reset();
    Object.keys(this.roleMainFormGroup.controls).forEach(key => {
      this.roleMainFormGroup.get(key).markAsUntouched();
    });

  }

  SaveClicked(): void {
    if (this.roleMainFormGroup.valid) {
      if (this.role.RoleID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'Role'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.role.RoleName = this.roleMainFormGroup.get('roleName').value;
              this.role.AppIDList = <number[]>this.roleMainFormGroup.get('appIDList').value;
              this.role.ModifiedBy = this.authenticationDetails.userID.toString();

              this._masterService.UpdateRole(this.role).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Role updated successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this._masterService.TriggerNotification('Role updated successfully');
                },
                (err) => {
                  console.error(err);
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  this.ShowProgressBarEvent.emit('hide');
                }
              );
            }
          });

      } else {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Create',
            Catagory: 'role'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.role.RoleName = this.roleMainFormGroup.get('roleName').value;
              this.role.AppIDList = this.roleMainFormGroup.get('appIDList').value;
              this.role.CreatedBy = this.authenticationDetails.userID.toString();
              this._masterService.CreateRole(this.role).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Role created successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this._masterService.TriggerNotification('Role created successfully');
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
      Object.keys(this.roleMainFormGroup.controls).forEach(key => {
        this.roleMainFormGroup.get(key).markAsTouched();
        this.roleMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  DeleteClicked(): void {
    if (this.roleMainFormGroup.valid) {
      if (this.role.RoleID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Delete',
            Catagory: 'Role'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.role.RoleName = this.roleMainFormGroup.get('roleName').value;
              this.role.AppIDList = <number[]>this.roleMainFormGroup.get('appIDList').value;
              this.role.ModifiedBy = this.authenticationDetails.userID.toString();

              this._masterService.DeleteRole(this.role).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Role deleted successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this._masterService.TriggerNotification('Role deleted successfully');
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
      Object.keys(this.roleMainFormGroup.controls).forEach(key => {
        this.roleMainFormGroup.get(key).markAsTouched();
        this.roleMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    this.role = this.currentSelectedRole;
    if (this.role) {
      this.roleMainFormGroup.get('roleName').patchValue(this.role.RoleName);
      this.roleMainFormGroup.get('appIDList').patchValue(this.role.AppIDList);
    } else {
      // this.menuAppMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

  OnAppNameChanged(): void {
    // console.log('changed');
    const SelectedValues = this.roleMainFormGroup.get('appIDList').value as number[];
    if (SelectedValues.includes(this.AppIDListAllID)) {
      this.roleMainFormGroup.get('appIDList').patchValue([this.AppIDListAllID]);
      this.notificationSnackBarComponent.openSnackBar('All have all the menu items, please uncheck All if you want to select specific menu', SnackBarStatus.info, 4000);

    }
    // console.log(this.roleMainFormGroup.get('appIDList').value);
  }

}

// function multiSelectRequired(control: AbstractControl): { [key: string]: any } | null {
//   const email: string[] = control.value;
//   if (email) {
//     if (email.length > 0) {
//       return null;
//     } else {
//       return { 'multiSelectRequired': true };
//     }
//   } else {
//     return { 'multiSelectRequired': true };
//   }
// }

// export class CustomValidators {
//   static SelectedRole(role: string): { [key: string]: any } | null {
//     return (control: AbstractControl): { [key: string]: any } | null => {
//       if (!control.parent || !control) {
//         return null;
//       }
//       const selectedAppID: number[] = control.value;
//       const selectedRole: string = control.parent.get('roleName').value;
//       if (role === selectedRole) {
//         return null;
//       } else {
//         if (selectedAppID) {
//           if (selectedAppID.length > 0) {
//             return null;
//           } else {
//             return { 'appIDRequired': true };
//           }
//         } else {
//           console.log('entered');
//           return { 'appIDRequired': true };
//         }
//       }
//     };
//   }
// }


