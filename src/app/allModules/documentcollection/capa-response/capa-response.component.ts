import { Component, OnInit } from '@angular/core';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { DocumentCollectionService } from 'app/services/document-collection.service';
import { MasterService } from 'app/services/master.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { CAPAHeader, CAPAHeaderView, CAPAAllocationVendorView, CAPAResponse, CAPAResponseView, CAPAStatusView, CAPAConfirmationStatusView } from 'app/models/document-collection.model';
import { Guid } from 'guid-typescript';
import { RFQView } from 'app/models/rfq.model';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { CapaConfirmationDialogComponent } from '../capa-confirmation-dialog/capa-confirmation-dialog.component';

@Component({
  selector: 'app-capa-response',
  templateUrl: './capa-response.component.html',
  styleUrls: ['./capa-response.component.scss']
})
export class CapaResponseComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  CurrentUserRole = '';
  CurrentDate: Date;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  BGClassName: any;
  searchText = '';
  AllCAPA: CAPAHeaderView[] = [];
  SelectedCAPA = new CAPAHeaderView();
  SelectedCAPAID = 0;
  SelectedCAPAStaus = '';
  SelectedCAPAAllocationVendors: CAPAAllocationVendorView[] = [];
  SelectedCAPAResponses: CAPAResponseView[] = [];
  CAPAResponseFormGroup: FormGroup;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _documentCollectionService: DocumentCollectionService,
    private _masterService: MasterService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {
    this.CurrentDate = new Date();
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
      this.CurrentUserRole = this.authenticationDetails.userRole;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('CAPAResponse') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this._fuseConfigService.config.subscribe((config) => {
      this.BGClassName = config;
    });
    if (this.CurrentUserRole === 'Vendor') {
      this.GetCAPAByVendor();
    } else {
      this.GetCAPAByUser();
    }
    this.CAPAResponseFormGroup = this._formBuilder.group({
      Comments: ['', Validators.required],
    });
  }
  GetCAPAByUser(): void {
    this.IsProgressBarVisibile = true;
    this._documentCollectionService.GetCAPAByUser(this.CurrentUserID).subscribe(
      (data) => {
        if (data) {
          this.AllCAPA = data as CAPAHeaderView[];
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.log(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  GetCAPAByVendor(): void {
    this.IsProgressBarVisibile = true;
    this._documentCollectionService.GetCAPAByVendor(this.CurrentUserID).subscribe(
      (data) => {
        if (data) {
          this.AllCAPA = data as CAPAHeaderView[];
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.log(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  LoadSelectedCAPA(SelectedCAPA: CAPAHeaderView): void {
    this.SelectedCAPA = SelectedCAPA;
    this.SelectedCAPAID = +SelectedCAPA.CAPAID;
    this.SelectedCAPAStaus = SelectedCAPA.CAPAStatus;
    this.GetCAPAResponseByCAPA();
    this.GetCAPAAllocationVendorViewByCAPA();
  }

  ResetForm(): void {
    this.CAPAResponseFormGroup.reset();
    Object.keys(this.CAPAResponseFormGroup.controls).forEach(key => {
      this.CAPAResponseFormGroup.get(key).markAsUntouched();
    });
  }
  ResetControl(): void {
    this.ResetForm();
    this.SelectedCAPAID = 0;
    this.SelectedCAPAStaus = '';
    this.SelectedCAPA = new CAPAHeaderView();
    this.SelectedCAPAResponses = [];
    this.SelectedCAPAAllocationVendors = [];
  }
  ValidateCAPAResponse(): void {
    if (this.CAPAResponseFormGroup.valid) {
      const Actiontype = 'Update';
      const Catagory = 'CAPA Response';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.ShowValidationErrors();
    }
  }
  CloseTicket(): void {
    const Actiontype = 'Close';
    const Catagory = 'CAPA';
    this.OpenCAPAConfirmationDialog(Actiontype, Catagory);
  }

  ReOpenCloseTicket(): void {
    const Actiontype = 'Re-open';
    const Catagory = 'CAPA';
    this.OpenCAPAConfirmationDialog(Actiontype, Catagory);
  }

  ShowValidationErrors(): void {
    Object.keys(this.CAPAResponseFormGroup.controls).forEach(key => {
      if (!this.CAPAResponseFormGroup.get(key).valid) {
        console.log(key);
      }
      this.CAPAResponseFormGroup.get(key).markAsTouched();
      this.CAPAResponseFormGroup.get(key).markAsDirty();
    });
  }

  OpenCAPAConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Reason: ''
      },
      panelClass: 'capa-confirm-dialog'
    };
    const dialogRef = this.dialog.open(CapaConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const res = result as CAPAConfirmationStatusView;
          if (Actiontype === 'Close') {
            this.CloseCAPA(res.Reason);
          }
          if (Actiontype === 'Re-open') {
            this.ReOpenCAPA(res.Reason);
          }
        }
      });
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
          if (Actiontype === 'Update') {
            this.CreateCAPAResponse();
          }
        }
      });
  }

  CreateCAPAResponse(): void {
    this.IsProgressBarVisibile = true;
    const capaResponse: CAPAResponse = new CAPAResponse();
    capaResponse.CAPAID = this.SelectedCAPAID;
    capaResponse.Comments = this.CAPAResponseFormGroup.get('Comments').value;
    capaResponse.CreatedBy = this.CurrentUserID.toString();
    this._documentCollectionService.CreateCAPAResponse(capaResponse).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('CAPA Response details updated successfully', SnackBarStatus.success);
        this.ResetForm();
        this.GetCAPAResponseByCAPA();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  CloseCAPA(Reason: string): void {
    const CAPAStatusVieww: CAPAStatusView = new CAPAStatusView();
    CAPAStatusVieww.CAPAID = this.SelectedCAPAID;
    CAPAStatusVieww.CAPAStatus = 'Closed';
    CAPAStatusVieww.Reason = Reason;
    CAPAStatusVieww.ModifiedBy = this.CurrentUserID.toString();
    this._documentCollectionService.UpdateCAPAStatus(CAPAStatusVieww).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('CAPA status updated successfully', SnackBarStatus.success);
        this.ResetControl();
        // this.GetCAPAResponseByCAPA();
        // this.SelectedCAPAStaus = 'Closed';
        if (this.CurrentUserRole === 'Vendor') {
          this.GetCAPAByVendor();
        } else {
          this.GetCAPAByUser();
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  ReOpenCAPA(Reason: string): void {
    const CAPAStatusVieww: CAPAStatusView = new CAPAStatusView();
    CAPAStatusVieww.CAPAID = this.SelectedCAPAID;
    CAPAStatusVieww.CAPAStatus = 'InProgress';
    CAPAStatusVieww.Reason = Reason;
    CAPAStatusVieww.ModifiedBy = this.CurrentUserID.toString();
    this._documentCollectionService.UpdateCAPAStatus(CAPAStatusVieww).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('CAPA status updated successfully', SnackBarStatus.success);
        this.ResetControl();
        // this.GetCAPAResponseByCAPA();
        // this.SelectedCAPAStaus = 'InProgress';
        if (this.CurrentUserRole === 'Vendor') {
          this.GetCAPAByVendor();
        } else {
          this.GetCAPAByUser();
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetCAPAResponseByCAPA(): void {
    this._documentCollectionService.GetCAPAResponseByCAPA(this.SelectedCAPAID).subscribe(
      (data) => {
        if (data) {
          this.SelectedCAPAResponses = data as CAPAResponseView[];
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.log(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  GetCAPAAllocationVendorViewByCAPA(): void {
    this._documentCollectionService.GetCAPAAllocationVendorViewByCAPA(this.SelectedCAPAID).subscribe(
      (data) => {
        if (data) {
          this.SelectedCAPAAllocationVendors = data as CAPAAllocationVendorView[];
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.log(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

}
