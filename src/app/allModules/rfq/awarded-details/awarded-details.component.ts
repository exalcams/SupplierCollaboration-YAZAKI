import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { RFQRankView, PurchaseRequisitionView, RFQAwardVendorView, RFQStatusCount } from 'app/models/rfq.model';
import { RFQService } from 'app/services/rfq.service';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';

@Component({
  selector: 'awarded-details',
  templateUrl: './awarded-details.component.html',
  styleUrls: ['./awarded-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AwardedDetailsComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  BGClassName: any;
  FilterValue: string;
  SelectedPurchaseRequisition: PurchaseRequisitionView;
  SelectedRFQID: number;
  RFQRanks: RFQRankView[] = [];
  SelectedRFQRank: RFQRankView;
  RFQRankDisplayedColumns: string[] = ['MaterialDescription', 'OrderQuantity', 'UOM', 'DelayDays', 'Schedule', 'Price', 'SelfLifeDays', 'BestForItems'];
  RFQRankDataSource: MatTableDataSource<RFQRankView>;
  selection = new SelectionModel<RFQRankView>(true, []);
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  rFQStatusCount: RFQStatusCount;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _rfqService: RFQService,
    private _shareParameterService: ShareParameterService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.SelectedRFQRank = new RFQRankView();
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.rFQStatusCount = new RFQStatusCount();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQAwardedDetails') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.SelectedPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    this._shareParameterService.SetPurchaseRequisition(null);
    if (!this.SelectedPurchaseRequisition) {
      this._router.navigate(['/rfq/evaluation']);
    } else {
      this.FilterValue = 'ByVendor';
      this.SelectedRFQID = this.SelectedPurchaseRequisition.RFQID;
      this.GetAwarderedRFQByRFQID();
    }
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
    this.GetRFQStatusCountByBuyer();
  }
  GetRFQStatusCountByBuyer(): void {
    this._rfqService.GetRFQStatusCountByBuyer(this.CurrentUserID).subscribe(
      (data) => {
        this.rFQStatusCount = data as RFQStatusCount;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAwarderedRFQByRFQID(): void {
    this.IsProgressBarVisibile = true;
    this._rfqService.GetAwarderedRFQByRFQID(this.SelectedRFQID).subscribe(
      (data) => {
        if (data) {
          this.RFQRanks = data as RFQRankView[];
          // this.RFQRanks.forEach(x => {
          //   x.VendorID = x.VendorID.replace(/^0+/, '');
          // });
          this.RFQRankDataSource = new MatTableDataSource(this.RFQRanks);
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  RowSelected(data: RFQRankView): void {
    this.SelectedRFQRank = data;
  }

  FilterValueChange(): void {
    console.log(this.FilterValue);
  }

  ResetCheckbox(): void {
    this.selection.clear();
    this.RFQRankDataSource.data.forEach(row => this.selection.deselect(row));
  }
}

