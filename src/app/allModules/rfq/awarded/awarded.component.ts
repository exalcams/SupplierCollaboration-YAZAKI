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
import { RFQRankView, PurchaseRequisitionView, RFQAwardVendorView, RFQStatusCount, RFQResponseTechRating, RFQResponseTechRatingView, RFQVendorRank } from 'app/models/rfq.model';
import { RFQService } from 'app/services/rfq.service';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { StarRatingComponent } from 'ng-starrating';
import { TechRatingDialogComponent } from '../tech-rating-dialog/tech-rating-dialog.component';
import { TechRatingReviewDialogComponent } from '../tech-rating-review-dialog/tech-rating-review-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { AbstractControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
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
  CurrentUserRole: string;
  BGClassName: any;
  FilterValue: string;
  SelectedPurchaseRequisition: PurchaseRequisitionView;
  SelectedRFQID: number;
  RFQRanks: RFQVendorRank[] = [];
  RFQResponseTechRatingViewList: RFQResponseTechRatingView[] = [];
  SelectedVendor: string;
  SelectedVendorName: string;
  RFQRankDisplayedColumns: string[] =
    ['Parameter', 'VendorID1', 'VendorID2', 'VendorID3'];
  RFQRankDataSource: MatTableDataSource<RFQVendorRank>;
  RFQResponseTechRatingsColumns: string[] = ['VendorID', 'TechRating', 'Comment'];
  RFQResponseTechRatingDataSource = new BehaviorSubject<AbstractControl[]>([]);
  RFQResponseTechRatingFormGroup: FormGroup;
  RFQResponseTechRatingsFormArray: FormArray = this._formBuilder.array([]);
  selection = new SelectionModel<RFQVendorRank>(true, []);
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  rFQStatusCount: RFQStatusCount;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _rfqService: RFQService,
    private _shareParameterService: ShareParameterService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.SelectedVendor = '';
    this.SelectedVendorName = '';
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
      this.CurrentUserRole = this.authenticationDetails.userRole;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQAwarded') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }

    this.RFQResponseTechRatingFormGroup = this._formBuilder.group({
      RFQResponseTechRatings: this.RFQResponseTechRatingsFormArray
    });

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

  ResetControl(): void {
    this.RFQResponseTechRatingFormGroup.reset();
    Object.keys(this.RFQResponseTechRatingFormGroup.controls).forEach(key => {
      this.RFQResponseTechRatingFormGroup.get(key).markAsUntouched();
    });
    this.ResetRFQResponseTechRatings();
  }
  ResetRFQResponseTechRatings(): void {
    this.ClearFormArray(this.RFQResponseTechRatingsFormArray);
    this.RFQResponseTechRatingDataSource.next(this.RFQResponseTechRatingsFormArray.controls);
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
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
    this.RFQResponseTechRatingViewList = [];
    this.IsProgressBarVisibile = true;
    this._rfqService.GetRFQRanksByRFQID(this.SelectedRFQID, this.CurrentUserID.toString()).subscribe(
      (data) => {
        if (data) {
          this.RFQRanks = data as RFQVendorRank[];
          this.RFQRanks.forEach(x => {
            if (x.RFQResponseTechRatingViewList && x.RFQResponseTechRatingViewList.length && x.RFQResponseTechRatingViewList.length > 0) {
              this.RFQResponseTechRatingViewList = x.RFQResponseTechRatingViewList;
            }
          });
          if (this.RFQResponseTechRatingViewList.length > 0) {
            this.RFQResponseTechRatingViewList.forEach(x => {
              this.InsertRFQResponsesFormGroup(x);
            });
          }
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

  InsertRFQResponsesFormGroup(rfqResponseTechRatingView: RFQResponseTechRatingView): void {
    const row = this._formBuilder.group({
      VendorID: [rfqResponseTechRatingView.VendorID],
      VendorName: [rfqResponseTechRatingView.VendorName],
      EmailId: [rfqResponseTechRatingView.EmailId],
      GSTNumber: [rfqResponseTechRatingView.GSTNumber],
      TechRating: [rfqResponseTechRatingView.TechRating],
      Comment: [rfqResponseTechRatingView.Comment],
    });
    this.RFQResponseTechRatingsFormArray.push(row);
    this.RFQResponseTechRatingDataSource.next(this.RFQResponseTechRatingsFormArray.controls);
  }

  VendorClicked(VendorName: string, VendorID: string): void {
    this.SelectedVendorName = VendorName;
    this.SelectedVendor = VendorID;
  }

  FilterValueChange(): void {
    // console.log(this.FilterValue);
  }

  ResetCheckbox(): void {
    this.selection.clear();
    this.RFQRankDataSource.data.forEach(row => this.selection.deselect(row));
  }
  SaveClicked(): void {
    const Actiontype = 'Save';
    const Catagory = 'ratings';
    this.OpenConfirmationDialog(Actiontype, Catagory);
  }

  SaveAndAssignClicked(): void {
    // if (this.selection && this.selection.selected.length) {
    if (this.SelectedVendor) {
      const Actiontype = 'award';
      const Catagory = `vendor ${this.SelectedVendorName}(${this.SelectedVendor}) for RFQ ${this.SelectedRFQID}`;
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.notificationSnackBarComponent.openSnackBar('no vendor selected', SnackBarStatus.warning);
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
          if (Actiontype === 'award') {
            this.AwardSelectedVendor();
          }
          else if (Actiontype === 'Save') {
            this.CreateRFQResponseTechRating();
          }
        }
      });
  }
  AwardSelectedVendor(): void {
    const RFQAwardVendor: RFQAwardVendorView = new RFQAwardVendorView();
    RFQAwardVendor.RFQID = this.SelectedRFQID;
    RFQAwardVendor.VendorID = this.SelectedVendor;
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

  CreateRFQResponseTechRating(): void {
    this.GetRFQResponseTechRatingValues();
    this.IsProgressBarVisibile = true;
    this._rfqService.CreateRFQResponseTechRating(this.RFQResponseTechRatingViewList).subscribe(
      (data1) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Tech rating is updated', SnackBarStatus.success);
        // this._router.navigate(['/rfq/evaluation']);
        this.ResetControl();
        this.GetRFQRanksByRFQID();
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  onRate($event: { oldValue: number, newValue: number, starRating: StarRatingComponent }, index: number): void {
    // console.log($event.newValue);
    const RFQResponseTechRatingss = this.RFQResponseTechRatingFormGroup.get('RFQResponseTechRatings') as FormArray;
    RFQResponseTechRatingss.controls[index].get('TechRating').patchValue($event.newValue);
    // console.log(element);
  }

  GetRFQResponseTechRatingValues(): void {
    // this.RFQResponseTechRatingViewList = [];
    const RFQResponseTechRatingss = this.RFQResponseTechRatingFormGroup.get('RFQResponseTechRatings') as FormArray;
    RFQResponseTechRatingss.controls.forEach((x, i) => {
      const VendId = x.get('VendorID').value;
      const rfq = this.RFQResponseTechRatingViewList.find(y => y.VendorID === VendId);
      rfq.RFQID = this.SelectedRFQID;
      rfq.VendorID = x.get('VendorID').value;
      rfq.VendorName = x.get('VendorName').value;
      rfq.EmailId = x.get('EmailId').value;
      rfq.GSTNumber = x.get('GSTNumber').value;
      rfq.TechRating = x.get('TechRating').value;
      rfq.Comment = x.get('Comment').value;
      rfq.CreatedBy = this.CurrentUserID.toString();
      rfq.CreatedByUser = this.CurrentUserName.toString();
      // this.RFQResponseTechRatingViewList.push(rfq);
    });
  }

  AssignmentClicked(element: RFQRankView): void {
    let rfqResponseTechRating: RFQResponseTechRating = new RFQResponseTechRating();
    this._rfqService.GetRFQResponseTechRatingByApprover(element.RFQID, this.CurrentUserID.toString()).subscribe(
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
    // rfqResponseTechRating.ItemID = element.ItemID;
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
          // this.CreateRFQResponseTechRating(re);
        }
      });
  }


  GetRFQResponseTechRatings(VendorID: any): void {
    this._rfqService.GetRFQResponseTechRatings(this.SelectedRFQID, VendorID).subscribe(
      (data) => {
        if (data) {
          const rfqResponseTechRatings = data as RFQResponseTechRatingView[];
          // console.log(rfqResponseTechRatings);
          if (rfqResponseTechRatings && rfqResponseTechRatings.length && rfqResponseTechRatings.length > 0) {
            this.OpenTechRationgReviewDialog(rfqResponseTechRatings);
          } else {
            this.notificationSnackBarComponent.openSnackBar('Not yet rated', SnackBarStatus.info);
          }
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

