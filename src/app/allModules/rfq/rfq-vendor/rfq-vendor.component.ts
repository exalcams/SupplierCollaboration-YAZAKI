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
import { SelectionModel } from '@angular/cdk/collections';

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
  SelectedRFQList: RFQHeaderVendorView[];
  BGClassName: any;
  RFQColumns: string[] = ['Select', 'RFQID', 'Title', 'SupplyPlant', 'Currency', 'RFQResponseStartDate', 'RFQResponseStartTime',
    'IncoTerm', 'RFQResponseEndDate', 'RFQResponseEndTime', 'Status', 'Action'];
  RFQDataSource: MatTableDataSource<RFQHeaderVendorView>;
  rFQStatusCount: RFQStatusCount;
  selection = new SelectionModel<RFQHeaderVendorView>(true, []);
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
    this.ResetValues();
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
  ResetValues(): void {
    this.SelectedRFQList = [];
    this.ResetCheckbox();
  }
  ResetCheckbox(): void {
    this.selection.clear();
    if (this.RFQDataSource && this.RFQDataSource.data) {
      this.RFQDataSource.data.forEach(row => this.selection.deselect(row));
    }
  }
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
    if (this.RFQByVendorStatus === 'Archived') {
      this.SelectedRFQ = new RFQHeaderVendorView();
      this.IsProgressBarVisibile = true;
      this._rfqService.GetAllArchivedRFQByVendor(this.CurrentUserID).subscribe(
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
    if (this.RFQByVendorStatus === 'Expired') {
      this.SelectedRFQ = new RFQHeaderVendorView();
      this.IsProgressBarVisibile = true;
      this._rfqService.GetAllExpiredRFQByVendor(this.CurrentUserID).subscribe(
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
  onChangeChk($event, data: RFQHeaderVendorView): void {
    // $event.source.checked = !$event.source.checked;
    this.selection.toggle(data);
    if ($event.source.checked) {
      this.SelectedRFQ = data;
    } else {
      if (this.selection.selected && this.selection.selected.length && this.selection.selected.length > 0) {
        this.SelectedRFQ = this.selection.selected[this.selection.selected.length - 1];
      } else {
        this.SelectedRFQ = null;
      }
    }
  }


  RowSelected(data: RFQHeaderVendorView): void {
    this.SelectedRFQ = data;
  }

  GetRowColor(data: RFQHeaderVendorView): string {
    if (data) {
      // if (data === this.SelectedRFQ) {
      //   return 'highlight';
      // }
      // else 
      if (data.Status.toLowerCase() === 'awarded') {
        return 'awardedColor';
      }
      else {
        const Today = new Date();
        if (Today < new Date(data.RFQResponseStartDate)) {
          return 'jasmineBg';
        }
        else if (Today > new Date(data.RFQResponseEndDate)) {
          return 'expColor';
        }
        else if (Today >= new Date(data.RFQResponseStartDate) && Today <= new Date(data.RFQResponseEndDate)) {
          return 'mintGreen';
        } else {
          return 'expColor';
        }
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
        this.notificationSnackBarComponent.openSnackBar('Validity is already over', SnackBarStatus.danger);
      } else {
        this._shareParameterService.SetRFQHeaderVendor(this.SelectedRFQ);
        this._router.navigate(['/rfq/response'], {
        });
      }
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select a RFQ', SnackBarStatus.danger);
    }
  }

  RFQByVendorStatusChange(): void {
    // if (this.RFQByVendorStatus === 'Allocated') {
    //   this.GetAllCompletedRFQByVendor();
    // }
    // if (this.RFQByVendorStatus === 'Responded') {
    //   this.GetAllCompletedRFQByVendor();
    // }
    // if (this.RFQByVendorStatus === 'Archived') {
    //   this.GetAllCompletedRFQByVendor();
    // }
    this.GetAllCompletedRFQByVendor();
  }
  CreateSupportTicketClicked(element: RFQHeaderVendorView): void {
    if (element && element.RFQID) {
      this._shareParameterService.SetRFQID(element.RFQID);
      this._router.navigate(['/supportTicket']);
    } else {
      // this.notificationSnackBarComponent.openSnackBar('Please select the PO ', SnackBarStatus.danger);
    }
  }

  ArchiveSelectedRFQClicked(): void {
    if (this.selection && this.selection.selected.length) {
      this.selection.selected.forEach(x => {
        const index = this.SelectedRFQList.findIndex(y => y.RFQID === x.RFQID);
        if (index < 0) {
          x.CreatedBy = this.CurrentUserID.toString();
          this.SelectedRFQList.push(x);
        }
      });
      this.ArchiveSelectedRFQs();
    } else {
      this.notificationSnackBarComponent.openSnackBar('no items selected', SnackBarStatus.warning);
    }

  }

  ArchiveSelectedRFQs(): void {
    this.IsProgressBarVisibile = true;
    this._rfqService.ArchiveSelectedRFQs(this.SelectedRFQList).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Selected RFQs are archived successfully', SnackBarStatus.success);
        this.ResetValues();
        this.GetAllCompletedRFQByVendor();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);

      }
    );
  }

}
