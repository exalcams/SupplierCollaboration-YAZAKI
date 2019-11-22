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
import { RFQRankView, PurchaseRequisitionView, RFQAwardVendorView, RFQStatusCount, RFQResponseTechRating, RFQResponseTechRatingView } from 'app/models/rfq.model';
import { RFQService } from 'app/services/rfq.service';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { StarRatingComponent } from 'ng-starrating';
import { TechRatingDialogComponent } from '../tech-rating-dialog/tech-rating-dialog.component';
import { TechRatingReviewDialogComponent } from '../tech-rating-review-dialog/tech-rating-review-dialog.component';
// import { StarRatingComponent } from 'angular-star-rating';
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
  SelectedPurchaseRequisition: PurchaseRequisitionView;
  SelectedRFQID: number;
  RFQRanks: RFQRankView[] = [];
  SelectedRFQRank: RFQRankView;
  RFQRankDisplayedColumns: string[] =
    ['VendorName', 'MaterialDescription', 'OrderQuantity', 'UOM', 'DelayDays', 'Schedule', 'Price', 'SelfLifeDays', 'TechRating', 'BestForItems', 'View', 'Comment'];
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
      if (this.MenuItems.indexOf('RFQAwarded') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.SelectedPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    if (!this.SelectedPurchaseRequisition) {
      this._router.navigate(['/rfq/evaluation']);
    } else {
      this.FilterValue = 'ByVendor';
      this.SelectedRFQID = this.SelectedPurchaseRequisition.RFQID;
      this.GetRFQRanksByRFQID();
    }
    this.GetRFQStatusCountByBuyer();
    // this.SelectedRFQID = this._shareParameterService.GetRFQID();
    // if (!this.SelectedRFQID) {
    //   this._router.navigate(['/rfq/evaluation']);
    // } else {
    //   this.FilterValue = 'ByVendor';
    //   this.GetRFQRanksByRFQID();
    // }
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
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

  GetRFQRanksByRFQID(): void {
    this.IsProgressBarVisibile = true;
    this._rfqService.GetRFQRanksByRFQID(this.SelectedRFQID).subscribe(
      (data) => {
        if (data) {
          this.RFQRanks = data as RFQRankView[];
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

  SaveClicked(): void {
    // if (this.selection && this.selection.selected.length) {
    if (this.SelectedRFQRank && this.SelectedRFQRank.RFQID) {
      const Actiontype = 'Award';
      const Catagory = 'vendor';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.notificationSnackBarComponent.openSnackBar('no items selected', SnackBarStatus.warning);
    }
  }
  OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: Catagory
      },
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.AwardSelectedVendor();
        }
      });
  }
  AwardSelectedVendor(): void {
    const RFQAwardVendor: RFQAwardVendorView = new RFQAwardVendorView();
    RFQAwardVendor.RFQID = this.SelectedRFQRank.RFQID;
    RFQAwardVendor.VendorID = this.SelectedRFQRank.VendorID;
    RFQAwardVendor.ModifiedBy = this.CurrentUserID.toString();
    this.IsProgressBarVisibile = true;
    this._rfqService.AwardSelectedVendor(RFQAwardVendor).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Selected vendor is awardeded', SnackBarStatus.success);
        this._shareParameterService.SetPurchaseRequisition(this.SelectedPurchaseRequisition);
        this._router.navigate(['/rfq/awardedDetails']);
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  onRate($event: { oldValue: number, newValue: number, starRating: StarRatingComponent }, element: RFQRankView): void {
    // console.log($event.newValue);
    // console.log(element);
  }
  AssignmentClicked(element: RFQRankView): void {
    let rfqResponseTechRating: RFQResponseTechRating = new RFQResponseTechRating();
    this._rfqService.GetRFQResponseTechRatingByApprover(element.RFQID, element.ItemID, element.VendorID, this.CurrentUserID.toString()).subscribe(
      (data) => {
        if (data) {
          rfqResponseTechRating = data as RFQResponseTechRating;
        }
        if (rfqResponseTechRating && rfqResponseTechRating.RFQID) {
          rfqResponseTechRating.ModifiedBy = this.CurrentUserID.toString();
          this.OpenTechRationgDialog(rfqResponseTechRating);
        } else {
          this.NewRFQResponseTechRating(element, rfqResponseTechRating);
        }
      },
      (err) => {
        console.error(err);
        this.NewRFQResponseTechRating(element, rfqResponseTechRating);
      }
    );
  }

  NewRFQResponseTechRating(element: RFQRankView, rfqResponseTechRating: RFQResponseTechRating): void {
    rfqResponseTechRating.RFQID = element.RFQID;
    rfqResponseTechRating.ItemID = element.ItemID;
    rfqResponseTechRating.VendorID = element.VendorID;
    rfqResponseTechRating.TechRating = 0;
    rfqResponseTechRating.CreatedBy = this.CurrentUserID.toString();
    this.OpenTechRationgDialog(rfqResponseTechRating);
  }

  OpenTechRationgDialog(rfqResponseTechRating: RFQResponseTechRating): void {
    const dialogConfig: MatDialogConfig = {
      data: rfqResponseTechRating,
      panelClass: 'tech-rating-dialog'
    };
    const dialogRef = this.dialog.open(TechRatingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const re = result as RFQResponseTechRating;
          // console.log(rfqResponseTechRating);
          this.CreateRFQResponseTechRating(re);
        }
      });
  }
  CreateRFQResponseTechRating(rfqResponseTechRating: RFQResponseTechRating): void {
    this.IsProgressBarVisibile = true;
    this._rfqService.CreateRFQResponseTechRating(rfqResponseTechRating).subscribe(
      (data1) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Tech rating is updated', SnackBarStatus.success);
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);

      }
    );
  }

  GetRFQResponseTechRatings(element: RFQRankView): void {
    this._rfqService.GetRFQResponseTechRatings(element.RFQID, element.ItemID, element.VendorID).subscribe(
      (data) => {
        if (data) {
          const rfqResponseTechRatings = data as RFQResponseTechRatingView[];
          console.log(rfqResponseTechRatings);
          this.OpenTechRationgReviewDialog(rfqResponseTechRatings);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
  OpenTechRationgReviewDialog(rfqResponseTechRatings: RFQResponseTechRatingView[]): void {
    const dialogConfig: MatDialogConfig = {
      data: rfqResponseTechRatings,
      panelClass: 'tech-rating-review-dialog'
    };
    const dialogRef = this.dialog.open(TechRatingReviewDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {

        }
      });
  }
  // RatingsChange(event, element: RFQRankView): void {
  //   console.log(event.rating);
  //   console.log(element);
  // }

}

