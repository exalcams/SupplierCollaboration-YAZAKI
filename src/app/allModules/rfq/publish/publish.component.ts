import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { PurchaseRequisition } from 'app/models/rfq.model';
import { RFQService } from 'app/services/rfq.service';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PublishComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  CurrentUserName: string;
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
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetPurchaseRequisitionsByRFQStatus();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }
  GetPurchaseRequisitionsByRFQStatus(): void {
    this.SelectedPurchaseRequisition = new PurchaseRequisition();
    this.IsProgressBarVisibile = true;
    this._rfqService.GetPurchaseRequisitionsByRFQStatus(this.RFQStatus).subscribe(
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
  RFQStatusChange(): void {
    this.GetPurchaseRequisitionsByRFQStatus();
  }

  RowSelected(data: PurchaseRequisition): void {
    this.SelectedPurchaseRequisition = data;
  }

  CreateRFQClicked(): void {
    if (this.SelectedPurchaseRequisition && this.SelectedPurchaseRequisition.PurchaseRequisitionID) {
      this._router.navigate(['/rfq/creation'], {
        queryParams:
        {
          id: this.SelectedPurchaseRequisition.PurchaseRequisitionID,
          status: this.SelectedPurchaseRequisition.RFQStatus
        },
        // skipLocationChange: true
      });
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select a purchase requisition', SnackBarStatus.danger);
    }
  }

}

