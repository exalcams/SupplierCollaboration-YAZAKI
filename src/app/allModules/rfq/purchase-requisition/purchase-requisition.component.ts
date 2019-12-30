import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { PurchaseRequisition, PurchaseRequisitionView, PurchaseRequisitionStatusCount, RFQHeader, RFQStatusCount } from 'app/models/rfq.model';
import { RFQService } from 'app/services/rfq.service';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { ShareParameterService } from 'app/services/share-parameter.service';

@Component({
  selector: 'purchase-requisition',
  templateUrl: './purchase-requisition.component.html',
  styleUrls: ['./purchase-requisition.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  // animations: fuseAnimations
})
export class PurchaseRequisitionComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  RFQStatus: string;
  SelectedRFQ: RFQHeader;
  RFQs: RFQHeader[];
  BGClassName: any;
  // RFQColumns: string[] = ['PurchaseRequisitionID', 'PurchaseDate', 'PurchaseOrganization', 'PurchaseGroup', 'CompanyCode', 'Buyer', 'State', 'Publishing', 'Response', 'Awarded'];
  RFQColumns: string[] = ['RFQID', 'RFQDate', 'PurchaseOrganization', 'PurchaseGroup', 'CompanyCode', 'Buyer', 'Status'];
  RFQDataSource: MatTableDataSource<RFQHeader>;
  rfqStatusCount: RFQStatusCount;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _rfqService: RFQService,
    private _shareParameterService: ShareParameterService,
    private _router: Router,
    public snackBar: MatSnackBar
  ) {
    this.RFQStatus = 'Open';
    this.SelectedRFQ = new RFQHeader();
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.rfqStatusCount = new RFQStatusCount();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('PurchaseRequisition') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetRFQStatusCount();
    this.GetRFQByStatus();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }
  GetRFQStatusCount(): void {
    this._rfqService.GetRFQStatusCount().subscribe(
      (data) => {
        this.rfqStatusCount = data as RFQStatusCount;
      },
      (err) => {
        console.error(err);
      }
    );
  }
  GetRFQByStatus(): void {
    this.SelectedRFQ = new RFQHeader();
    this.IsProgressBarVisibile = true;
    this._rfqService.GetRFQByStatus(this.RFQStatus).subscribe(
      (data) => {
        this.RFQs = data as RFQHeader[];
        this.RFQDataSource = new MatTableDataSource(this.RFQs);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  RFQStatusChange(): void {
    this.GetRFQByStatus();
  }

  RowSelected(data: RFQHeader): void {
    this.SelectedRFQ = data;
  }

  CreateRFQClicked(): void {
    if (this.SelectedRFQ && this.SelectedRFQ.RFQID) {
      const PurchaseRequisition1: PurchaseRequisitionView = new PurchaseRequisitionView();
      PurchaseRequisition1.RFQID = this.SelectedRFQ.RFQID;
      PurchaseRequisition1.RFQStatus = this.SelectedRFQ.Status;

      this._shareParameterService.SetPurchaseRequisition(PurchaseRequisition1);
      this._router.navigate(['/rfq/creation'], {
        // queryParams:
        // {
        //   id: this.SelectedRFQ.PurchaseRequisitionID,
        //   status: this.SelectedRFQ.RFQStatus
        // },
        // skipLocationChange: true
      });
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select a purchase requisition', SnackBarStatus.danger);
    }
  }

}

