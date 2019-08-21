import { Component, OnInit } from '@angular/core';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { PurchaseRequisition, PurchaseRequisitionView } from 'app/models/rfq.model';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';
import { RFQService } from 'app/services/rfq.service';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-purchase-requisition-vendor',
  templateUrl: './purchase-requisition-vendor.component.html',
  styleUrls: ['./purchase-requisition-vendor.component.scss']
})
export class PurchaseRequisitionVendorComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  CurrentUserName: string;
  CurrentUserID: Guid;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  RFQStatus: string;
  SelectedPurchaseRequisition: PurchaseRequisition;
  PurchaseRequisitions: PurchaseRequisition[];
  BGClassName: any;
  PurchaseRequisitionColumns: string[] = ['PurchaseRequirement', 'PurchaseDate', 'PurchaseOrganization', 'PurchaseGroup', 'CompanyCode', 'Buyer', 'Station', 'Publishing', 'Response', 'Awarded'];
  PurchaseRequisitionDataSource: MatTableDataSource<PurchaseRequisition>;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _rfqService: RFQService,
    private _shareParameterService: ShareParameterService,
    private _router: Router,
    public snackBar: MatSnackBar
  ) {
    this.RFQStatus = 'Open';
    this.SelectedPurchaseRequisition = new PurchaseRequisition();
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetAllCompletedPurchaseRequisitionByVendor();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }
  GetAllCompletedPurchaseRequisitionByVendor(): void {
    this.SelectedPurchaseRequisition = new PurchaseRequisition();
    this.IsProgressBarVisibile = true;
    this._rfqService.GetAllCompletedPurchaseRequisitionByVendor(this.CurrentUserID).subscribe(
      (data) => {
        this.PurchaseRequisitions = data as PurchaseRequisition[];
        this.PurchaseRequisitionDataSource = new MatTableDataSource(this.PurchaseRequisitions);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  RowSelected(data: PurchaseRequisition): void {
    this.SelectedPurchaseRequisition = data;
  }

  GoToRFQResponse(): void {
    if (this.SelectedPurchaseRequisition && this.SelectedPurchaseRequisition.PurchaseRequisitionID) {
      let PurchaseRequisition: PurchaseRequisitionView = new PurchaseRequisitionView();
      PurchaseRequisition.PurchaseRequisitionID = this.SelectedPurchaseRequisition.PurchaseRequisitionID;
      PurchaseRequisition.RFQStatus = this.SelectedPurchaseRequisition.RFQStatus;
      this._shareParameterService.SetPurchaseRequisition(PurchaseRequisition);
      this._router.navigate(['/rfq/response'], {
      });
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select a purchase requisition', SnackBarStatus.danger);
    }
  }

}
