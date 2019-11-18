import { Component, OnInit } from '@angular/core';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { PurchaseRequisition, PurchaseRequisitionView, RFQHeaderVendorView, RFQStatusCount } from 'app/models/rfq.model';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';
import { RFQService } from 'app/services/rfq.service';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'rfq-vendor',
  templateUrl: './rfq-vendor.component.html',
  styleUrls: ['./rfq-vendor.component.scss']
})
export class RFQVendorComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  // RFQStatus: string;
  RFQByVendorStatus: string;
  // SelectedPurchaseRequisition: PurchaseRequisition;
  // PurchaseRequisitions: PurchaseRequisition[];
  SelectedRFQ: RFQHeaderVendorView;
  RFQs: RFQHeaderVendorView[];
  BGClassName: any;
  RFQColumns: string[] = ['RFQID', 'Title', 'SupplyPlant', 'Currency', 'RFQResponseStartDate', 'IncoTerm', 'RFQResponseEndDate', 'Status', 'RFQResponseStatus'];
  RFQDataSource: MatTableDataSource<RFQHeaderVendorView>;
  rFQStatusCount: RFQStatusCount;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _rfqService: RFQService,
    private _shareParameterService: ShareParameterService,
    private _router: Router,
    public snackBar: MatSnackBar
  ) {
    this.RFQByVendorStatus = 'Allocated';
    // this.SelectedPurchaseRequisition = new PurchaseRequisition();
    this.SelectedRFQ = new RFQHeaderVendorView();
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
      if (this.MenuItems.indexOf('RFQVendor') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    // this.GetAllCompletedPurchaseRequisitionByVendor();
    this.GetRFQStatusCountByVendor();
    this.GetAllCompletedRFQByVendor();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }
  // GetAllCompletedPurchaseRequisitionByVendor(): void {
  //   this.SelectedPurchaseRequisition = new PurchaseRequisition();
  //   this.IsProgressBarVisibile = true;
  //   this._rfqService.GetAllCompletedPurchaseRequisitionByVendor(this.CurrentUserID).subscribe(
  //     (data) => {
  //       this.PurchaseRequisitions = data as PurchaseRequisition[];
  //       this.PurchaseRequisitionDataSource = new MatTableDataSource(this.PurchaseRequisitions);
  //       this.IsProgressBarVisibile = false;
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.IsProgressBarVisibile = false;
  //     }
  //   );
  // }
  GetRFQStatusCountByVendor(): void {
    this._rfqService.GetRFQStatusCountByVendor(this.CurrentUserID).subscribe(
      (data) => {
        this.rFQStatusCount = data as RFQStatusCount;
      },
      (err) => {
        console.error(err);
      }
    );
  }
  GetAllCompletedRFQByVendor(): void {
    if (this.RFQByVendorStatus === 'Allocated') {
      this.SelectedRFQ = new RFQHeaderVendorView();
      this.IsProgressBarVisibile = true;
      this._rfqService.GetAllAllocatedRFQByVendor(this.CurrentUserID).subscribe(
        (data) => {
          this.RFQs = data as RFQHeaderVendorView[];
          this.RFQDataSource = new MatTableDataSource(this.RFQs);
          this.IsProgressBarVisibile = false;
        },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        }
      );
    }
    if (this.RFQByVendorStatus === 'Responded') {
      this.SelectedRFQ = new RFQHeaderVendorView();
      this.IsProgressBarVisibile = true;
      this._rfqService.GetAllRespondedRFQByVendor(this.CurrentUserID).subscribe(
        (data) => {
          this.RFQs = data as RFQHeaderVendorView[];
          this.RFQDataSource = new MatTableDataSource(this.RFQs);
          this.IsProgressBarVisibile = false;
        },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        }
      );
    }
  }

  RowSelected(data: RFQHeaderVendorView): void {
    this.SelectedRFQ = data;
  }

  GetRowColor(data: RFQHeaderVendorView): string {
    if (data === this.SelectedRFQ) {
      return 'highlight';
    } else {
      const Today = new Date();
      if (Today < new Date(data.RFQResponseStartDate)) {
        return 'jasmineBg';
      }
      else if (Today > new Date(data.RFQResponseEndDate)) {
        return '';
      }
      else if (Today >= new Date(data.RFQResponseStartDate) && Today <= new Date(data.RFQResponseEndDate)) {
        return 'mintGreen';
      } else {
        return '';
      }
    }
  }

  GoToRFQResponse(): void {
    if (this.SelectedRFQ && this.SelectedRFQ.RFQID) {
      const Today = new Date();
      if (Today < new Date(this.SelectedRFQ.RFQResponseStartDate)) {
        this.notificationSnackBarComponent.openSnackBar('Validity is not yet started', SnackBarStatus.danger);
      }
      else if (Today > new Date(this.SelectedRFQ.RFQResponseEndDate)) {
        this.notificationSnackBarComponent.openSnackBar('Validity date is already over', SnackBarStatus.danger);
      } else {
        this._shareParameterService.SetRFQHeaderVendor(this.SelectedRFQ);
        this._router.navigate(['/rfq/response'], {
        });
      }
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select a purchase requisition', SnackBarStatus.danger);
    }
  }

  RFQByVendorStatusChange(): void {
    if (this.RFQByVendorStatus === 'Allocated') {
      this.GetAllCompletedRFQByVendor();
    }
    if (this.RFQByVendorStatus === 'Responded') {
      this.GetAllCompletedRFQByVendor();
    }
  }

}
