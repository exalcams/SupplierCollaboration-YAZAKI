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
import { RFQAllocationView, RFQHeaderView, RFQResponseReceivedView } from 'app/models/rfq.model';
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
  SelectedRFQ: RFQHeaderView;
  SelectedRFQStatus = '';
  SelectedRFQID = 0;
  RFQHeaders: RFQHeaderView[] = [];
  RFQResponsesReceived: RFQResponseReceivedView[] = [];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _shareParameterService: ShareParameterService,
    private _rfqService: RFQService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.SelectedRFQ = new RFQHeaderView();
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
    this.GetAllCompletedRFQByBuyer();
  }

  GetAllCompletedRFQByBuyer(): void {
    this.IsProgressBarVisibile = true;
    this._rfqService.GetAllCompletedRFQByBuyer(this.CurrentUserID).subscribe(
      (data) => {
        if (data) {
          this.RFQHeaders = data as RFQHeaderView[];
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  GetRFQResponse(rfq: RFQHeaderView): void {
    this.SelectedRFQ = rfq;
    this.SelectedRFQID = this.SelectedRFQ.RFQID;
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
    console.log('EvaluateRFQResponse');
  }

}

