import { Component, OnInit } from '@angular/core';
import { AuthenticationDetails, App } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { FuseConfigService } from '@fuse/services/config.service';
import {
  SupportTicketWithEmails, SupportTicketResponseView, SupportTicketResponse, SupportTicketStatusView,
  SupportTicketConfirmationStatusView, STCategoryView, STExpectedResultView, STReasonView
} from 'app/models/supportTicket.model';
import { SupportTicketService } from 'app/services/support-ticket.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SupportTicketConfirmationDialogComponent } from './support-ticket-confirmation-dialog/support-ticket-confirmation-dialog.component';
import { Auxiliary } from 'app/models/asn';
import { MasterService } from 'app/services/master.service';
// import { SupportTicketConfirmationDialogComponent } from '../documentcollection/SupportTicket-confirmation-dialog/SupportTicket-confirmation-dialog.component';
import * as FileSaver from 'file-saver';
import { ShareParameterService } from 'app/services/share-parameter.service';

@Component({
  selector: 'app-support-ticket',
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.scss']
})
export class SupportTicketComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  CurrentUserRole = '';
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  BGClassName: any;
  compStyles: CSSStyleDeclaration;
  AllCategories: STCategoryView[];
  AllReasons: STReasonView[];
  AllExpectedResults: STExpectedResultView[];
  searchText = '';
  AllSupportTicketWithEmails: SupportTicketWithEmails[] = [];
  SelectedSupportTicket: SupportTicketWithEmails;
  SelectedTicketID = 0;
  SelectedSupportTicketStaus: string;
  SupportTicketFormGroup: FormGroup;
  SupportTicketResponseFormGroup: FormGroup;
  SelectedSupportTicketResponses: SupportTicketResponseView[] = [];
  fileToUpload: File;
  fileToUploadList: File[] = [];
  SupportTicketAppID: number;
  CurrentPONumber: string;
  CurrentRFQID: number;
  IsSupportTicketResponseUpdated = false;
  ReferenceValue = 'Ref. ';
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _supportTicketService: SupportTicketService,
    private _shareParameterService: ShareParameterService,
    private _masterService: MasterService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.SelectedSupportTicket = new SupportTicketWithEmails();
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    const PON = this._shareParameterService.GetPONumber();
    if (PON) {
      this.CurrentPONumber = PON;
      this._shareParameterService.SetPONumber('');
    }
    const RID = this._shareParameterService.GetRFQID();
    if (RID) {
      this.CurrentRFQID = RID;
      this._shareParameterService.SetRFQID(0);
    }
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
      this.CurrentUserRole = this.authenticationDetails.userRole;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('SupportTicket') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this._fuseConfigService.config.subscribe((config) => {
      this.BGClassName = config;
      const backgroundElement = document.querySelector(`.${this.BGClassName.layout.toolbar.background}`);
      this.compStyles = window.getComputedStyle(backgroundElement);
    });
    this.SupportTicketFormGroup = this._formBuilder.group({
      Category: ['', Validators.required],
      ReferenceNumber: [''],
      Reason: ['', Validators.required],
      ExpectedResult: ['', Validators.required],
      Query: ['', Validators.required],
      CC: ['', Validators.required],
    });
    this.SupportTicketResponseFormGroup = this._formBuilder.group({
      Comments: ['', Validators.required],
    });
    this.GetAppByName();
    this.GetAllCategories();
    this.GetAllReasons();
    this.GetAllExpectedResults();
    this.GetSupportTicketDetails();
  }

  ResetForm(): void {
    this.ResetSupportTicketForm();
    this.ResetSupportTicketResponseForm();
  }
  ResetSupportTicketForm(): void {
    this.SupportTicketFormGroup.reset();
    Object.keys(this.SupportTicketFormGroup.controls).forEach(key => {
      this.SupportTicketFormGroup.get(key).markAsUntouched();
    });
  }
  ResetSupportTicketResponseForm(): void {
    this.SupportTicketResponseFormGroup.reset();
    Object.keys(this.SupportTicketResponseFormGroup.controls).forEach(key => {
      this.SupportTicketResponseFormGroup.get(key).markAsUntouched();
    });
  }
  ResetControl(): void {
    this.CurrentPONumber = '';
    this.CurrentRFQID = 0;
    this.ResetForm();
    this.EnableFormControls(this.SupportTicketFormGroup);
    this.SelectedTicketID = 0;
    this.SelectedSupportTicketStaus = '';
    this.SelectedSupportTicket = new SupportTicketWithEmails();
    this.SelectedSupportTicketResponses = [];
    this.IsSupportTicketResponseUpdated = false;
    this.fileToUpload = null;
    this.fileToUploadList = [];
    this.ReferenceValue = 'Ref .';
  }

  GetAllCategories(): void {
    this._supportTicketService.GetAllCategories().subscribe(
      (data) => {
        if (data) {
          this.AllCategories = data as STCategoryView[];
          if (this.CurrentUserRole === 'Vendor') {
            if (this.CurrentPONumber) {
              this.InsertSupportTicketPONumber();
            }
            if (this.CurrentRFQID && this.CurrentRFQID > 0) {
              this.InsertSupportTicketRFQID();
            }
          }
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAllReasons(): void {
    this._supportTicketService.GetAllReasons().subscribe(
      (data) => {
        if (data) {
          this.AllReasons = data as STReasonView[];
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAllExpectedResults(): void {
    this._supportTicketService.GetAllExpectedResults().subscribe(
      (data) => {
        if (data) {
          this.AllExpectedResults = data as STExpectedResultView[];
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAppByName(): void {
    const AppName = 'SupportTicket';
    this._masterService.GetAppByName(AppName).subscribe(
      (data) => {
        const SupportTicketAPP = data as App;
        if (SupportTicketAPP) {
          this.SupportTicketAppID = SupportTicketAPP.AppID;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetSupportTicketDetails(): void {
    if (this.CurrentUserRole === 'Vendor') {
      this.GetSupportTicketByVendor();
    } else {
      this.GetSupportTicketByBuyer();
    }
  }

  GetSupportTicketByVendor(): void {
    this.IsProgressBarVisibile = true;
    this._supportTicketService.GetSupportTicketByVendor(this.CurrentUserID).subscribe(
      (data) => {
        if (data) {
          this.AllSupportTicketWithEmails = data as SupportTicketWithEmails[];
          if (this.AllSupportTicketWithEmails.length && this.AllSupportTicketWithEmails.length > 0) {
            if (this.CurrentPONumber) {
              this.InsertSupportTicketPONumber();
            }
            else if (this.CurrentRFQID) {
              this.InsertSupportTicketRFQID();
            }
            else {
              if (!this.IsSupportTicketResponseUpdated) {
                this.LoadSelectedSupportTicket(this.AllSupportTicketWithEmails[0]);
              } else {
                const x = this.AllSupportTicketWithEmails.filter(xy => xy.TicketID === this.SelectedTicketID)[0];
                if (x) {
                  this.LoadSelectedSupportTicket(x);
                }
              }
            }
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
  GetSupportTicketByBuyer(): void {
    this.IsProgressBarVisibile = true;
    this._supportTicketService.GetSupportTicketByBuyer(this.CurrentUserID).subscribe(
      (data) => {
        if (data) {
          this.AllSupportTicketWithEmails = data as SupportTicketWithEmails[];
          if (this.AllSupportTicketWithEmails.length && this.AllSupportTicketWithEmails.length > 0) {
            if (!this.IsSupportTicketResponseUpdated) {
              this.LoadSelectedSupportTicket(this.AllSupportTicketWithEmails[0]);
            } else {
              const x = this.AllSupportTicketWithEmails.filter(xy => xy.TicketID === this.SelectedTicketID)[0];
              if (x) {
                this.LoadSelectedSupportTicket(x);
              }
            }
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

  LoadSelectedSupportTicket(selectedSupportTicket: SupportTicketWithEmails): void {
    this.ResetForm();
    this.SelectedSupportTicket = selectedSupportTicket;
    this.SelectedTicketID = +selectedSupportTicket.TicketID;
    this.SelectedSupportTicketStaus = selectedSupportTicket.SupportTicketStatus;
    this.GetSupportTicketByTicketID();
    this.GetSupportTicketResponseByTicketID();
    // this.GetSupportTicketAllocationVendorViewBySupportTicket();
  }

  AddNewSupportTicket(): void {
    this.ResetControl();
  }

  handleFileInput(evt, index: number): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUpload = evt.target.files[0];
      const FileExist = this.fileToUploadList.filter(x => x.name === this.fileToUpload.name);
      if (FileExist.length > 0) {
        this.notificationSnackBarComponent.openSnackBar('This file is already added', SnackBarStatus.danger);
      } else {
        this.fileToUploadList.push(this.fileToUpload);
      }
    }
  }
  CategorySelected(event): void {
    // console.log(event.value);
    const SelectedCategoryValue = event.value;
    this.CheckSelectedCategoryValue(SelectedCategoryValue);
  }

  CheckSelectedCategoryValue(SelectedCategoryValue: string): void {
    if (SelectedCategoryValue === 'Document upload' || SelectedCategoryValue === 'General') {
      this.SupportTicketFormGroup.get('ReferenceNumber').clearValidators();
      this.SupportTicketFormGroup.get('ReferenceNumber').updateValueAndValidity();
      this.ReferenceValue = 'Ref .';
    } else {
      this.SupportTicketFormGroup.get('ReferenceNumber').setValidators([Validators.required]);
      this.SupportTicketFormGroup.get('ReferenceNumber').updateValueAndValidity();
      if (SelectedCategoryValue === 'Purchase order') {
        this.ReferenceValue = 'PO';
      } else {
        this.ReferenceValue = SelectedCategoryValue;
      }
    }
  }

  ValidateSupportTicket(): void {
    if (this.SupportTicketFormGroup.valid) {
      const Actiontype = 'Create';
      const Catagory = 'Support ticket';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.ShowValidationErrors(this.SupportTicketFormGroup);
    }
  }

  ValidateSupportTicketResponse(): void {
    if (this.SupportTicketResponseFormGroup.valid) {
      const Actiontype = 'Reply';
      const Catagory = 'Support ticket';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.ShowValidationErrors(this.SupportTicketResponseFormGroup);
    }
  }
  CloseTicket(): void {
    const Actiontype = 'Close';
    const Catagory = 'SupportTicket';
    this.OpenSupportTicketConfirmationDialog(Actiontype);
  }

  ReOpenCloseTicket(): void {
    const Actiontype = 'Re-open';
    const Catagory = 'SupportTicket';
    this.OpenSupportTicketConfirmationDialog(Actiontype);
  }

  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (!formGroup.get(key).valid) {
        console.log(key);
      }
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
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
          if (Actiontype === 'Reply') {
            this.CreateSupportTicketResponse();
          }
          else if (Actiontype === 'Create') {
            this.CreateSupportTicket();
          }
        }
      });
  }
  CreateSupportTicket(): void {
    this.IsProgressBarVisibile = true;
    this.GetSupportTicketValues();
    this._supportTicketService.CreateSupportTicket(this.SelectedSupportTicket).subscribe(
      (data) => {
        const TransID = data as number;
        this.SelectedSupportTicket.TicketID = TransID;
        const aux = new Auxiliary();
        aux.APPID = this.SupportTicketAppID;
        aux.APPNumber = TransID;
        aux.CreatedBy = this.CurrentUserID.toString();
        if (this.fileToUploadList && this.fileToUploadList.length) {
          this._supportTicketService.AddSupportTicketAttachment(aux, this.fileToUploadList).subscribe(
            (dat) => {
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar('Support ticket details created successfully', SnackBarStatus.success);
              this.ResetControl();
              this.GetSupportTicketDetails();
            },
            (err) => {
              console.error(err);
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            }
          );
        } else {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Support ticket details created successfully', SnackBarStatus.success);
          this.GetSupportTicketDetails();
          this.ResetControl();
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetSupportTicketValues(): void {
    this.SelectedSupportTicket = new SupportTicketWithEmails();
    this.SelectedSupportTicket.Category = this.SupportTicketFormGroup.get('Category').value;
    this.SelectedSupportTicket.ReferenceNumber = this.SupportTicketFormGroup.get('ReferenceNumber').value;
    this.SelectedSupportTicket.Reason = this.SupportTicketFormGroup.get('Reason').value;
    this.SelectedSupportTicket.ExpectedResult = this.SupportTicketFormGroup.get('ExpectedResult').value;
    this.SelectedSupportTicket.Query = this.SupportTicketFormGroup.get('Query').value;
    this.SelectedSupportTicket.CreatedBy = this.CurrentUserID.toString();
    const emc = this.SupportTicketFormGroup.get('CC').value as string;
    if (emc) {
      this.SelectedSupportTicket.EmailAddresses = emc.split(',');
      if (this.SelectedSupportTicket.EmailAddresses.length && this.SelectedSupportTicket.EmailAddresses.length > 0) {
        this.SelectedSupportTicket.EmailAddresses.forEach(x => {
          x.trim();
        });
      }
    }
  }

  CreateSupportTicketResponse(): void {
    this.IsProgressBarVisibile = true;
    const supportTicketResponse: SupportTicketResponse = new SupportTicketResponse();
    supportTicketResponse.TicketID = this.SelectedTicketID;
    supportTicketResponse.Comments = this.SupportTicketResponseFormGroup.get('Comments').value;
    supportTicketResponse.CreatedBy = this.CurrentUserID.toString();
    this._supportTicketService.CreateSupportTicketResponse(supportTicketResponse).subscribe(
      () => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Support Ticket Response details updated successfully', SnackBarStatus.success);
        this.IsSupportTicketResponseUpdated = true;
        this.GetSupportTicketDetails();
        this.ResetForm();
        this.GetSupportTicketResponseByTicketID();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  OpenSupportTicketConfirmationDialog(Actiontype: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Reason: ''
      },
      panelClass: 'support-ticket-confirm-dialog'
    };
    const dialogRef = this.dialog.open(SupportTicketConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const res = result as SupportTicketConfirmationStatusView;
          if (Actiontype === 'Close') {
            this.CloseSupportTicket(res.Reason);
          }
          if (Actiontype === 'Re-open') {
            this.ReOpenSupportTicket(res.Reason);
          }
        }
      });
  }

  CloseSupportTicket(Reason: string): void {
    const SupportTicketStatusVieww: SupportTicketStatusView = new SupportTicketStatusView();
    SupportTicketStatusVieww.TicketID = this.SelectedTicketID;
    SupportTicketStatusVieww.SupportTicketStatus = 'Closed';
    SupportTicketStatusVieww.Reason = Reason;
    SupportTicketStatusVieww.ModifiedBy = this.CurrentUserID.toString();
    this._supportTicketService.UpdateSupportTicketStatus(SupportTicketStatusVieww).subscribe(
      () => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Support Ticket status updated successfully', SnackBarStatus.success);
        this.ResetControl();
        // this.GetSupportTicketResponseByTicketID();
        // this.SelectedSupportTicketStaus = 'Closed';
        this.GetSupportTicketDetails();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  ReOpenSupportTicket(Reason: string): void {
    const SupportTicketStatusVieww: SupportTicketStatusView = new SupportTicketStatusView();
    SupportTicketStatusVieww.TicketID = this.SelectedTicketID;
    SupportTicketStatusVieww.SupportTicketStatus = 'InProgress';
    SupportTicketStatusVieww.Reason = Reason;
    SupportTicketStatusVieww.ModifiedBy = this.CurrentUserID.toString();
    this._supportTicketService.UpdateSupportTicketStatus(SupportTicketStatusVieww).subscribe(
      () => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Support Ticket status updated successfully', SnackBarStatus.success);
        this.ResetControl();
        // this.GetSupportTicketResponseByTicketID();
        // this.SelectedSupportTicketStaus = 'InProgress';
        this.GetSupportTicketDetails();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
  GetSupportTicketByTicketID(): void {
    this._supportTicketService.GetSupportTicketByTicketID(this.SelectedTicketID).subscribe(
      (data) => {
        if (data) {
          this.SelectedSupportTicket = data as SupportTicketWithEmails;
          this.InsertSupportTicketValue();
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.log(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }
  GetSupportTicketResponseByTicketID(): void {
    this._supportTicketService.GetSupportTicketResponseByTicketID(this.SelectedTicketID).subscribe(
      (data) => {
        if (data) {
          this.SelectedSupportTicketResponses = data as SupportTicketResponseView[];
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.log(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  InsertSupportTicketPONumber(): void {
    this.SupportTicketFormGroup.get('Category').patchValue('Purchase order');
    this.SupportTicketFormGroup.get('ReferenceNumber').patchValue(this.CurrentPONumber);
    this.CheckSelectedCategoryValue('Purchase order');
  }
  InsertSupportTicketRFQID(): void {
    this.SupportTicketFormGroup.get('Category').patchValue('RFQ');
    this.SupportTicketFormGroup.get('ReferenceNumber').patchValue(this.CurrentRFQID);
    this.CheckSelectedCategoryValue('Purchase order');
  }

  InsertSupportTicketValue(): void {
    this.SupportTicketFormGroup.patchValue({
      Category: this.SelectedSupportTicket.Category,
      ReferenceNumber: this.SelectedSupportTicket.ReferenceNumber,
      Reason: this.SelectedSupportTicket.Reason,
      ExpectedResult: this.SelectedSupportTicket.ExpectedResult,
      Query: this.SelectedSupportTicket.Query
    });
    if (this.SelectedSupportTicket.EmailAddresses && this.SelectedSupportTicket.EmailAddresses.length) {
      this.SupportTicketFormGroup.get('CC').patchValue(this.SelectedSupportTicket.EmailAddresses.join());
    }
    this.DisableFormControls(this.SupportTicketFormGroup);
    this.CheckSelectedCategoryValue(this.SelectedSupportTicket.Category);
  }

  EnableFormControls(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).enable();
    });
  }

  DisableFormControls(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key).disable();
    });
  }

  DownloadSelectedFile(fileName: string): void {
    if (this.fileToUploadList && this.fileToUploadList.length && !this.SelectedTicketID) {
      const selectedFile = this.fileToUploadList.filter(x => x.name === fileName)[0];
      if (selectedFile) {
        const BlobFile = selectedFile as Blob;
        FileSaver.saveAs(BlobFile, fileName);
      }
    } else if (this.SelectedTicketID && this.SelectedSupportTicket.SupportTicketAttachments) {
      this._supportTicketService.DownloadSupportTicketAttachment(this.SupportTicketAppID, this.SelectedTicketID, fileName).subscribe(
        data => {
          if (data) {
            const BlobFile = data as Blob;
            FileSaver.saveAs(BlobFile, fileName);
          }
          // this.IsProgressBarVisibile = false;
        },
        error => {
          console.error(error);
          // this.IsProgressBarVisibile = false;
        }
      );
    }
  }

}
