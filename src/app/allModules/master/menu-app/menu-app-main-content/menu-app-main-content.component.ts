import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';
import { MenuApp, AuthenticationDetails } from 'app/models/master';

@Component({
  selector: 'menu-app-main-content',
  templateUrl: './menu-app-main-content.component.html',
  styleUrls: ['./menu-app-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MenuAppMainContentComponent implements OnInit, OnChanges {
  @Input() currentSelectedMenuApp: MenuApp = new MenuApp();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  menuApp: MenuApp;
  menuAppMainFormGroup: FormGroup;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];

  constructor(private _masterService: MasterService, private _formBuilder: FormBuilder, private _router: Router,
    public snackBar: MatSnackBar, private dialog: MatDialog) {
    this.menuAppMainFormGroup = this._formBuilder.group({
      appName: ['', Validators.required]
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.menuApp = new MenuApp();
    this.authenticationDetails = new AuthenticationDetails();
    // this.currentSelectedMenuApp = new MenuApp();
    // this.currentSelectedMenuApp.AppID = 0;
    // if(this.currentSelectedMenuApp)
    // console.log(this.currentSelectedMenuApp);
  }

  ngOnInit(): void {
    // console.log(this.currentSelectedMenuApp);
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('App') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  ResetControl(): void {
    // this.menuAppMainFormGroup.get('appName').patchValue('');
    this.menuApp = new MenuApp();
    this.menuAppMainFormGroup.reset();
    Object.keys(this.menuAppMainFormGroup.controls).forEach(key => {
      this.menuAppMainFormGroup.get(key).markAsUntouched();
    });

  }

  SaveClicked(): void {
    if (this.menuAppMainFormGroup.valid) {
      if (this.menuApp.AppID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'app'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.menuApp.AppName = this.menuAppMainFormGroup.get('appName').value;
              this.menuApp.ModifiedBy = this.authenticationDetails.userID.toString();
              this._masterService.UpdateMenuApp(this.menuApp).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('App updated successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this._masterService.TriggerNotification('App updated successfully');
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
            Catagory: 'app'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.menuApp = new MenuApp();
              this.menuApp.AppName = this.menuAppMainFormGroup.get('appName').value;
              this.menuApp.CreatedBy = this.authenticationDetails.userID.toString();
              this._masterService.CreateMenuApp(this.menuApp).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('App created successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this._masterService.TriggerNotification('App created successfully');
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
      Object.keys(this.menuAppMainFormGroup.controls).forEach(key => {
        this.menuAppMainFormGroup.get(key).markAsTouched();
        this.menuAppMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  DeleteClicked(): void {
    if (this.menuAppMainFormGroup.valid) {
      if (this.menuApp.AppID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Delete',
            Catagory: 'app'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.menuApp.AppName = this.menuAppMainFormGroup.get('appName').value;
              this.menuApp.ModifiedBy = this.authenticationDetails.userID.toString();
              this._masterService.DeleteMenuApp(this.menuApp).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('App deleted successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this._masterService.TriggerNotification('App deleted successfully');
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
      Object.keys(this.menuAppMainFormGroup.controls).forEach(key => {
        this.menuAppMainFormGroup.get(key).markAsTouched();
        this.menuAppMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    this.menuApp = this.currentSelectedMenuApp;
    if (this.menuApp) {
      this.menuAppMainFormGroup.get('appName').patchValue(this.menuApp.AppName);
    } else {
      // this.menuAppMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

}



