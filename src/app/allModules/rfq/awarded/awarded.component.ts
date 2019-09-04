import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
  selector: 'awarded',
  templateUrl: './awarded.component.html',
  styleUrls: ['./awarded.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AwardedComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  BGClassName: any;
  FilterValue: string;
  VendorComparsionClassList: VendorComparsionClass[] = [];
  displayedColumns: string[] = ['Select', 'VendorName', 'ItemDescription', 'Quantity', 'UOM', 'DelayDays', 'BestFor'];
  dataSource: MatTableDataSource<VendorComparsionClass>;
  selection = new SelectionModel<VendorComparsionClass>(true, []);
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQAwarded') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.FilterValue = 'All';
    this.VendorComparsionClassList = [
      {
        VendorName: 'Exalca Technologies', VendorCode: '80091', ItemDescription: 'Supplier success portal service', Quantity: 1.00,
        UOM: 'EA', DelayDays: 2, BestFor: 'money-bag'
      },
      {
        VendorName: 'Exalca Technologies', VendorCode: '80056', ItemDescription: 'Supplier success portal service', Quantity: 1.00,
        UOM: 'EA', DelayDays: 2, BestFor: 'calendar-color'
      },
      {
        VendorName: 'Exalca Technologies', VendorCode: '80050', ItemDescription: 'Supplier success portal service', Quantity: 1.00,
        UOM: 'EA', DelayDays: 2, BestFor: 'star'
      }
    ];
    this.dataSource = new MatTableDataSource(this.VendorComparsionClassList);
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }

  FilterValueChange(): void {
    console.log(this.FilterValue);
  }

  ResetCheckbox(): void {
    this.selection.clear();
    this.dataSource.data.forEach(row => this.selection.deselect(row));
  }

  SaveClicked(): void {
    if (this.selection && this.selection.selected.length) {

    } else {
      this.notificationSnackBarComponent.openSnackBar('no items selected', SnackBarStatus.warning);
    }
  }

}
export class VendorComparsionClass {
  VendorName: string;
  VendorCode: string;
  ItemDescription: string;
  Quantity: number;
  UOM: string;
  DelayDays: number;
  BestFor: string;
}
