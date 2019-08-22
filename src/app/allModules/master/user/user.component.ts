import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { UserWithRole, AuthenticationDetails } from 'app/models/master';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserComponent implements OnInit {
  BGClassName: any;
  AllUsers: UserWithRole[] = [];
  SelectedUser: UserWithRole;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];

  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;

  constructor(private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _router: Router,
    public snackBar: MatSnackBar) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = true;
  }

  ngOnInit(): void {

    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('User') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
      this.GetAllUsers();
    } else {
      this._router.navigate(['/auth/login']);
    }
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }

  GetAllUsers(): void {
    this._masterService.GetAllUsers().subscribe(
      (data) => {
        this.AllUsers = <UserWithRole[]>data;
        this.IsProgressBarVisibile = false;
        // console.log(this.AllUsers);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
  OnUserSelectionChanged(selectedUser: UserWithRole): void {
    // console.log(selectedMenuApp);
    this.SelectedUser = selectedUser;
  }
  OnShowProgressBarEvent(status: string): void {
    if (status === 'show') {
      this.IsProgressBarVisibile = true;
    } else {
      this.IsProgressBarVisibile = false;
    }

  }

  RefreshAllUsers(msg: string): void {
    // console.log(msg);
    this.GetAllUsers();
  }

}

