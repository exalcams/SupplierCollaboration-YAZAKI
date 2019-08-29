import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { AuthenticationDetails, App } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { RFQView, RFQResponseItemView, RFQResponseView, RFQItemView } from 'app/models/rfq.model';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RFQService } from 'app/services/rfq.service';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { MasterService } from 'app/services/master.service';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Auxiliary } from 'app/models/asn';
import { Location } from '@angular/common';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class ResponseComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  RFQResponseFormGroup: FormGroup;
  RFQResponseItemFormArray: FormArray = this._formBuilder.array([]);
  RFQResponseItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  VendorID: string;
  SelectedPurchaseRequisitionID: number;
  SelectedRFQStatus = '';
  RFQ: RFQView;
  RFQResponse: RFQResponseView;
  BGClassName: any;
  RFQResponseItemsColumns: string[] = ['ItemID', 'MaterialDescription', 'OrderQuantity', 'DelayDays', 'UOM', 'Price', 'SupplierPartNumber', 'Schedule', 'Attachment', 'TechRating'];
  RFQResponseItemAppID: number;
  @ViewChild('fileInput1') fileInput1: ElementRef;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private _rfqService: RFQService,
    private _shareParameterService: ShareParameterService,
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private renderer: Renderer
  ) {
    const CurrentPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    // console.log(CurrentPurchaseRequisition);
    if (CurrentPurchaseRequisition) {
      this.SelectedPurchaseRequisitionID = CurrentPurchaseRequisition.PurchaseRequisitionID;
      this.SelectedRFQStatus = CurrentPurchaseRequisition.RFQStatus;
    } else {
      this._router.navigate(['/rfq/prvendor']);
    }

    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.RFQ = new RFQView();
    this.RFQResponse = new RFQResponseView();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQResponse') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.RFQResponseFormGroup = this._formBuilder.group({
      Title: ['', Validators.required],
      SupplyPlant: ['', Validators.required],
      Currency: ['', Validators.required],
      RFQStartDate: ['', Validators.required],
      RFQResponseStartDate: ['', Validators.required],
      IncoTerm: ['', Validators.required],
      RFQEndDate: ['', Validators.required],
      RFQResponseEndDate: ['', Validators.required],
      RFQResponseItems: this.RFQResponseItemFormArray
      // CreatedBy: ['', Validators.required]
    });
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
    this.GetAppByName();
    this.GetRFQByPurchaseRequisitionID();
  }
  AddRFQResponseItemFormGroup(): void {
    const row = this._formBuilder.group({
      ItemID: ['', Validators.required],
      MaterialDescription: ['', Validators.required],
      OrderQuantity: ['', Validators.required],
      DelayDays: ['', Validators.required],
      UOM: ['', Validators.required],
      Price: ['', Validators.required],
      SupplierPartNumber: ['', Validators.required],
      Schedule: ['', Validators.required],
      NumberOfAttachments: [''],
      AttachmentNames: [[]],
      TechRating: ['', Validators.required],
    });
    this.RFQResponseItemFormArray.push(row);
    // row.get('NumberOfAttachments').disable();
    this.RFQResponseItemDataSource.next(this.RFQResponseItemFormArray.controls);
  }

  ResetControl(): void {
    this.RFQ = new RFQView();
    this.RFQResponseFormGroup.reset();
    Object.keys(this.RFQResponseFormGroup.controls).forEach(key => {
      this.RFQResponseFormGroup.get(key).markAsUntouched();
    });
    this.ResetRFQResponseItems();
  }
  ResetRFQResponseItems(): void {
    this.ClearFormArray(this.RFQResponseItemFormArray);
    this.RFQResponseItemDataSource.next(this.RFQResponseItemFormArray.controls);
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  GetAppByName(): void {
    const AppName = 'RFQResponseItem';
    this._masterService.GetAppByName(AppName).subscribe(
      (data) => {
        const RFQResponseItemAPP = data as App;
        if (RFQResponseItemAPP) {
          this.RFQResponseItemAppID = RFQResponseItemAPP.AppID;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // AddRFQResponseItem(): void {
  //   if (this.RFQResponseFormGroup.enabled) {
  //     this.AddRFQResponseItemFormGroup();
  //   }
  // }
  // RemoveRFQResponseItem(): void {
  //   if (this.RFQResponseFormGroup.enabled) {
  //     if (this.RFQResponseItemFormArray.length > 0) {
  //       const AttNames = this.RFQResponseItemFormArray.controls[this.RFQResponseItemFormArray.length - 1].get('AttachmentNames').value as string[];
  //       AttNames.forEach(x => {
  //         const indexx = this.fileToUploadList.map(y => y.name).indexOf(x);
  //         this.fileToUploadList.splice(indexx, 1);
  //       });
  //       this.RFQResponseItemFormArray.removeAt(this.RFQResponseItemFormArray.length - 1);
  //       this.RFQResponseItemDataSource.next(this.RFQResponseItemFormArray.controls);
  //     } else {
  //       this.notificationSnackBarComponent.openSnackBar('no items to delete', SnackBarStatus.warning);
  //     }
  //   }
  // }

  // AddAttachments(): void {
  //   if (this.RFQResponseFormGroup.enabled) {
  //     const event = new MouseEvent('click', { bubbles: true });
  //     this.renderer.invokeElementMethod(
  //       this.fileInput1.nativeElement, 'dispatchEvent', [event]);
  //   }
  // }

  // handleFileInput(evt, index: number): void {
  //   if (evt.target.files && evt.target.files.length > 0) {
  //     this.fileToUpload = evt.target.files[0];
  //     this.fileToUploadList.push(this.fileToUpload);
  //     const OldValue = +this.RFQResponseItemFormArray.controls[index].get('NumberOfAttachments').value;
  //     this.RFQResponseItemFormArray.controls[index].get('NumberOfAttachments').patchValue(OldValue + 1);
  //     const AttNames = this.RFQResponseItemFormArray.controls[index].get('AttachmentNames').value as string[];
  //     AttNames.push(this.fileToUpload.name);
  //     this.RFQResponseItemFormArray.controls[index].get('AttachmentNames').patchValue(AttNames);
  //   }
  // }


  GetRFQHeaderValues(): void {
    this.RFQ.Title = this.RFQResponseFormGroup.get('Title').value;
    this.RFQ.SupplyPlant = this.RFQResponseFormGroup.get('SupplyPlant').value;
    this.RFQ.Currency = this.RFQResponseFormGroup.get('Currency').value;
    this.RFQ.RFQStartDate = this.RFQResponseFormGroup.get('RFQStartDate').value;
    this.RFQ.RFQResponseStartDate = this.RFQResponseFormGroup.get('RFQResponseStartDate').value;
    this.RFQ.IncoTerm = this.RFQResponseFormGroup.get('IncoTerm').value;
    this.RFQ.RFQEndDate = this.RFQResponseFormGroup.get('RFQEndDate').value;
    this.RFQ.RFQResponseEndDate = this.RFQResponseFormGroup.get('RFQResponseEndDate').value;
  }

  GetRFQResponseHeaderValues(): void {
    this.RFQResponse.PurchaseRequisitionID = this.SelectedPurchaseRequisitionID;
    this.RFQResponse.RFQID = this.RFQ.RFQID;
    this.RFQResponse.UserID = this.authenticationDetails.userID;
  }

  GetRFQResponseItems(): void {
    this.RFQResponse.RFQResponseItems = [];
    const RFQResponseItemsFormArray = this.RFQResponseFormGroup.get('RFQResponseItems') as FormArray;
    RFQResponseItemsFormArray.controls.forEach((x, i) => {
      const rfq: RFQResponseItemView = new RFQResponseItemView();
      rfq.ItemID = x.get('ItemID').value;
      rfq.MaterialDescription = x.get('MaterialDescription').value;
      rfq.OrderQuantity = x.get('OrderQuantity').value;
      rfq.DelayDays = x.get('DelayDays').value;
      rfq.UOM = x.get('UOM').value;
      rfq.Price = x.get('Price').value;
      rfq.SupplierPartNumber = x.get('SupplierPartNumber').value;
      rfq.Schedule = x.get('Schedule').value;
      rfq.NumberOfAttachments = x.get('NumberOfAttachments').value;
      rfq.AttachmentNames = x.get('AttachmentNames').value;
      rfq.TechRating = x.get('TechRating').value;
      rfq.APPID = this.RFQResponseItemAppID;
      this.RFQResponse.RFQResponseItems.push(rfq);
    });
  }
  ValidateRFQResponse(): void {
    // this.RFQResponseFormGroup.enable();
    if (this.RFQResponseFormGroup.valid) {
      if (this.RFQResponse.RFQID) {
        const Actiontype = 'Update';
        const Catagory = 'RFQ Response';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      } else {
        const Actiontype = 'Create';
        const Catagory = 'RFQ Response';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      }
    } else {
      this.ShowValidationErrors();
    }
  }

  ShowValidationErrors(): void {
    Object.keys(this.RFQResponseFormGroup.controls).forEach(key => {
      if (!this.RFQResponseFormGroup.get(key).valid) {
        console.log(key);
      }
      this.RFQResponseFormGroup.get(key).markAsTouched();
      this.RFQResponseFormGroup.get(key).markAsDirty();
      if (this.RFQResponseFormGroup.get(key) instanceof FormArray) {
        const FormArrayControls = this.RFQResponseFormGroup.get(key) as FormArray;
        Object.keys(FormArrayControls.controls).forEach(key1 => {
          if (FormArrayControls.get(key1) instanceof FormGroup) {
            const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
            Object.keys(FormGroupControls.controls).forEach(key2 => {
              FormGroupControls.get(key2).markAsTouched();
              FormGroupControls.get(key2).markAsDirty();
              if (!FormGroupControls.get(key2).valid) {
                console.log(key2);
              }
            });
          } else {
            FormArrayControls.get(key1).markAsTouched();
            FormArrayControls.get(key1).markAsDirty();
          }
        });
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
          this.SaveRFQResponse();
        }
      });
  }

  SaveRFQResponse(): void {
    if (this.RFQResponse.RFQID) {
      this.UpdateRFQResponse();
    } else {
      this.CreateRFQResponse();
    }
  }

  CreateRFQResponse(): void {
    this.IsProgressBarVisibile = true;
    // this.GetRFQHeaderValues();
    this.GetRFQResponseHeaderValues();
    this.GetRFQResponseItems();
    this.RFQResponse.CreatedBy = this.CurrentUserName;
    this._rfqService.CreateRFQResponse(this.RFQResponse).subscribe(
      (data) => {
        const TransID = data as number;
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('RFQ Response details created successfully', SnackBarStatus.success);
        this.ResetControl();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        // this.ResetControl();
      }
    );
  }

  UpdateRFQResponse(): void {
    this.IsProgressBarVisibile = true;
    // this.GetRFQHeaderValues();
    this.GetRFQResponseHeaderValues();
    this.GetRFQResponseItems();
    this.RFQResponse.ModifiedBy = this.CurrentUserName;
    this._rfqService.UpdateRFQResponse(this.RFQResponse).subscribe(
      (data) => {
        const TransID = data as number;
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('RFQ Response details updated successfully', SnackBarStatus.success);
        this.ResetControl();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.ResetControl();
      }
    );
  }

  GoToAllocateRFQ(): void {
    const CurrentPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    CurrentPurchaseRequisition.RFQID = this.RFQ.RFQID;
    this._shareParameterService.SetPurchaseRequisition(CurrentPurchaseRequisition);
    this._router.navigate(['/rfq/evaluation']);
  }

  InsertRFQHeaderValues(): void {
    this.RFQResponseFormGroup.patchValue({
      Title: this.RFQ.Title,
      SupplyPlant: this.RFQ.SupplyPlant,
      Currency: this.RFQ.Currency,
      RFQStartDate: this.RFQ.RFQStartDate,
      RFQResponseStartDate: this.RFQ.RFQResponseStartDate,
      IncoTerm: this.RFQ.IncoTerm,
      RFQEndDate: this.RFQ.RFQEndDate,
      RFQResponseEndDate: this.RFQ.RFQResponseEndDate
    });
  }

  InsertRFQResponseItemsFormGroup(RFQItem: RFQItemView): void {
    const row = this._formBuilder.group({
      ItemID: [RFQItem.ItemID, Validators.required],
      MaterialDescription: [RFQItem.MaterialDescription, Validators.required],
      OrderQuantity: [RFQItem.OrderQuantity, Validators.required],
      DelayDays: [RFQItem.DelayDays, Validators.required],
      UOM: [RFQItem.UOM, Validators.required],
      Price: [RFQItem.Price, Validators.required],
      Schedule: [RFQItem.Schedule, Validators.required],
      NumberOfAttachments: [RFQItem.NumberOfAttachments],
      AttachmentNames: [RFQItem.AttachmentNames],
      SupplierPartNumber: [RFQItem.SupplierPartNumber, Validators.required],
      TechRating: [RFQItem.TechRating, Validators.required],
    });
    this.RFQResponseItemFormArray.push(row);
    this.RFQResponseItemDataSource.next(this.RFQResponseItemFormArray.controls);
    // return row;
  }

  GetRFQByPurchaseRequisitionID(): void {
    this._rfqService.GetRFQByPurchaseRequisitionID(this.SelectedPurchaseRequisitionID).subscribe(
      (data) => {
        this.RFQ = data as RFQView;
        if (this.RFQ) {
          this.InsertRFQHeaderValues();
          if (this.RFQ.RFQItems && this.RFQ.RFQItems.length) {
            this.ClearFormArray(this.RFQResponseItemFormArray);
            this.RFQ.RFQItems.forEach((x, i) => {
              this.InsertRFQResponseItemsFormGroup(x);
            });
          } else {
            this.ResetRFQResponseItems();
          }
          this.RFQResponseFormGroup.disable();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

}
