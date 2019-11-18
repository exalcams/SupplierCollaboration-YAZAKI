import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { VendorSearchCondition, Vendor, AuthenticationDetails } from 'app/models/master';
import { MasterService } from 'app/services/master.service';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { Router } from '@angular/router';
import { RFQService } from 'app/services/rfq.service';
import { RFQAllocationView, RFQEvaluationView, RFQResponseReceivedView, PurchaseRequisitionView, RFQStatusCount } from 'app/models/rfq.model';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  BGClassName: any;
  SelectedPurchaseRequisitionID: number;
  SelectedRFQ: RFQEvaluationView;
  SelectedRFQStatus = '';
  SelectedRFQID = 0;
  RFQEvaluations: RFQEvaluationView[] = [];
  RFQResponsesReceived: RFQResponseReceivedView[] = [];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  rFQStatusCount: RFQStatusCount;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _shareParameterService: ShareParameterService,
    private _rfqService: RFQService,
    private _router: Router,
    public snackBar: MatSnackBar,
  ) {
    this.SelectedRFQ = new RFQEvaluationView();
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
      if (this.MenuItems.indexOf('RFQEvaluation') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this._fuseConfigService.config.subscribe((config) => {
      this.BGClassName = config;
    });
    this.GetRFQStatusCountByBuyer();
    this.GetAllCompletedRFQByBuyer();
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
  GetAllCompletedRFQByBuyer(): void {
    this.IsProgressBarVisibile = true;
    this._rfqService.GetAllCompletedRFQByBuyer(this.CurrentUserID).subscribe(
      (data) => {
        if (data) {
          this.RFQEvaluations = data as RFQEvaluationView[];
          if (this.RFQEvaluations && this.RFQEvaluations.length) {
            this.GetRFQResponse(this.RFQEvaluations[0]);
          }
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  GetRFQResponse(rfq: RFQEvaluationView): void {
    this.SelectedRFQ = rfq;
    this.SelectedRFQID = this.SelectedRFQ.RFQID;
    this.SelectedRFQStatus = this.SelectedRFQ.Status;
    this.IsProgressBarVisibile = true;
    this._rfqService.GetRFQResponseReceivedByRFQID(this.SelectedRFQID).subscribe(
      (data) => {
        if (data) {
          this.RFQResponsesReceived = data as RFQResponseReceivedView[];
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  EvaluateRFQResponse(): void {
    // console.log('EvaluateRFQResponse');
    const CurrentPurchaseRequisition = this.GetCurrentPurchaseRequisition();
    // this._shareParameterService.SetRFQID(this.SelectedRFQID);
    this._shareParameterService.SetPurchaseRequisition(CurrentPurchaseRequisition);
    this._router.navigate(['rfq/awarded']);
  }
  GoToAwardedDetails(): void {
    const CurrentPurchaseRequisition = this.GetCurrentPurchaseRequisition();
    this._shareParameterService.SetPurchaseRequisition(CurrentPurchaseRequisition);
    this._router.navigate(['/rfq/awardedDetails']);
  }

  GetCurrentPurchaseRequisition(): PurchaseRequisitionView {
    const CurrentPurchaseRequisition: PurchaseRequisitionView = new PurchaseRequisitionView();
    CurrentPurchaseRequisition.PurchaseRequisitionID = this.SelectedRFQ.PurchaseRequisitionID;
    CurrentPurchaseRequisition.RFQID = this.SelectedRFQID;
    CurrentPurchaseRequisition.RFQStatus = this.SelectedRFQ.Status;
    return CurrentPurchaseRequisition;
  }

}

