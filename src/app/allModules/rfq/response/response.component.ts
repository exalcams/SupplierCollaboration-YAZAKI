import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { AuthenticationDetails, App } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormArray, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { RFQView, RFQResponseItemView, RFQResponseView, RFQItemView, RFQHeaderVendorView, RFQWithResponseView, RFQStatusCount } from 'app/models/rfq.model';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RFQService } from 'app/services/rfq.service';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { MasterService } from 'app/services/master.service';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Auxiliary, AuxiliaryView } from 'app/models/asn';
import { Location, DatePipe } from '@angular/common';
import { Guid } from 'guid-typescript';
import { AttachmentsDialogComponent } from 'app/shared/attachments-dialog/attachments-dialog.component';
import { TermsAndConditionsDialogComponent } from '../terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class ResponseComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  RFQResponseFormGroup: FormGroup;
  RFQResponseItemFormArray: FormArray = this._formBuilder.array([]);
  RFQResponseItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  VendorID: string;
  SelectedRFQID: number;
  SelectedVendorID: string;
  SelectedRFQHeaderVendor: RFQHeaderVendorView;
  // SelectedPurchaseRequisitionID: number;
  SelectedRFQStatus = '';
  RFQ: RFQWithResponseView;
  RFQResponse: RFQResponseView;
  BGClassName: any;
  RFQResponseItemsColumns: string[] = ['IsResponded', 'ItemID', 'MaterialDescription', 'Manufacturer', 'OrderQuantity', 'UOM', 'DeliveryDate', 'DelayDays', 'Schedule',
    'Price', 'PaymentTerms', 'SupplierPartNumber', 'SelfLifeDays', 'Attachment', 'TechRating', 'Notes'];
  RFQResponseItemAppID: number;
  RFQItemAppID: number;
  @ViewChild('fileInput1') fileInput1: ElementRef;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  rFQStatusCount: RFQStatusCount;
  TermsAnContionStatus = false;
  selection = new SelectionModel<AbstractControl>(true, []);
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
    private renderer: Renderer,
    private _datePipe: DatePipe
  ) {
    const CurrentRFQHeaderVendor = this._shareParameterService.GetRFQHeaderVendor();
    if (CurrentRFQHeaderVendor) {
      this.SelectedRFQHeaderVendor = CurrentRFQHeaderVendor;
      this.SelectedRFQID = CurrentRFQHeaderVendor.RFQID;
      this.SelectedRFQStatus = CurrentRFQHeaderVendor.Status;
      this.SelectedVendorID = CurrentRFQHeaderVendor.VendorID;
    } else {
      this._router.navigate(['/rfq/rfqvendor']);
    }

    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.RFQ = new RFQWithResponseView();
    this.RFQResponse = new RFQResponseView();
    this.rFQStatusCount = new RFQStatusCount();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
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
      Name: [''],
      Email: ['', Validators.email],
      ContactNumber: [''],
      BankGuarantee: [false],
      RFQResponseItems: this.RFQResponseItemFormArray
      // CreatedBy: ['', Validators.required]
    });
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
    this.GetRFQStatusCountByVendor();
    this.GetAppByName();
    // this.GetRFQByPurchaseRequisitionID();
    if (this.SelectedRFQID && this.SelectedVendorID) {
      this.GetRFQByIDAndVendor();
    }
  }
  AddRFQResponseItemFormGroup(): void {
    // const row = this._formBuilder.group({
    //   ItemID: ['', Validators.required],
    //   MaterialDescription: ['', Validators.required],
    //   Manufacturer: ['', Validators.required],
    //   OrderQuantity: ['', Validators.required],
    //   DelayDays: ['', Validators.required],
    //   UOM: ['', Validators.required],
    //   Price: ['', Validators.required],
    //   PaymentTerms: ['', Validators.required],
    //   SupplierPartNumber: ['', Validators.required],
    //   Schedule: ['', Validators.required],
    //   NumberOfAttachments: [''],
    //   AttachmentNames: [[]],
    //   TechRating: ['', Validators.required],
    //   Notes: ['', Validators.required],
    // });
    const row = this._formBuilder.group({
      ItemID: [''],
      MaterialDescription: [''],
      Manufacturer: [''],
      OrderQuantity: [''],
      DelayDays: [''],
      UOM: [''],
      Price: [''],
      PaymentTerms: [''],
      SupplierPartNumber: [''],
      Schedule: [''],
      NumberOfAttachments: [''],
      AttachmentNames: [[]],
      TechRating: [''],
      Notes: [''],
    });
    this.RFQResponseItemFormArray.push(row);
    // row.get('NumberOfAttachments').disable();
    this.RFQResponseItemDataSource.next(this.RFQResponseItemFormArray.controls);
  }

  ResetControl(): void {
    this.RFQ = new RFQWithResponseView();
    this.RFQResponseFormGroup.reset();
    Object.keys(this.RFQResponseFormGroup.controls).forEach(key => {
      this.RFQResponseFormGroup.get(key).markAsUntouched();
    });
    this.ResetRFQResponseItems();
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
    let AppName = 'RFQResponseItem';
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
    AppName = 'RFQItem';
    this._masterService.GetAppByName(AppName).subscribe(
      (data) => {
        const ASNAPP = data as App;
        if (ASNAPP) {
          this.RFQItemAppID = ASNAPP.AppID;
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

  GetRFQByIDAndVendor(): void {
    this.IsProgressBarVisibile = true;
    this._rfqService.GetRFQByIDAndVendor(this.SelectedRFQID, this.SelectedVendorID).subscribe(
      (data) => {
        this.RFQ = data as RFQWithResponseView;
        if (this.RFQ) {
          this.InsertRFQHeaderValues();
          this.RFQResponseFormGroup.disable();
          this.RFQResponseFormGroup.get('Name').enable();
          this.RFQResponseFormGroup.get('Email').enable();
          this.RFQResponseFormGroup.get('ContactNumber').enable();
          this.RFQResponseFormGroup.get('BankGuarantee').enable();
          if (this.RFQ.RFQResponseItems && this.RFQ.RFQResponseItems.length) {
            this.ClearFormArray(this.RFQResponseItemFormArray);
            this.RFQ.RFQResponseItems.forEach((x, i) => {
              this.InsertRFQResponseItemsFormGroup(x);
            });
          } else {
            this.ResetRFQResponseItems();
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

  InsertRFQHeaderValues(): void {
    this.RFQResponseFormGroup.patchValue({
      Title: this.RFQ.Title,
      SupplyPlant: this.RFQ.SupplyPlant,
      Currency: this.RFQ.Currency,
      RFQStartDate: this.RFQ.RFQStartDate,
      RFQResponseStartDate: this.RFQ.RFQResponseStartDate,
      IncoTerm: this.RFQ.IncoTerm,
      RFQEndDate: this.RFQ.RFQEndDate,
      RFQResponseEndDate: this.RFQ.RFQResponseEndDate,
      Name: this.RFQ.Name,
      Email: this.RFQ.Email,
      ContactNumber: this.RFQ.ContactNumber,
      BankGuarantee: this.RFQ.BankGuarantee,
    });
  }

  InsertRFQResponseItemsFormGroup(RFQItem: RFQResponseItemView): void {
    const row = this._formBuilder.group({
      ItemID: [RFQItem.ItemID],
      MaterialDescription: [RFQItem.MaterialDescription],
      Manufacturer: [RFQItem.Manufacturer],
      OrderQuantity: [RFQItem.OrderQuantity],
      DelayDays: [RFQItem.DelayDays],
      UOM: [RFQItem.UOM],
      Price: [RFQItem.Price],
      PaymentTerms: [RFQItem.PaymentTerms],
      Schedule: [RFQItem.Schedule],
      ExpectedDeliveryDate: [RFQItem.ExpectedDeliveryDate],
      DeliveryDate: [RFQItem.DeliveryDate],
      SelfLifeDays: [RFQItem.SelfLifeDays],
      NumberOfAttachments: [RFQItem.NumberOfAttachments],
      AttachmentNames: [RFQItem.AttachmentNames],
      SupplierPartNumber: [RFQItem.SupplierPartNumber],
      TechRating: [RFQItem.TechRating],
      Notes: [RFQItem.Notes],
      IsResponded: [RFQItem.IsResponded],
    });
    row.disable();
    row.get('IsResponded').enable();
    row.get('Manufacturer').enable();
    row.get('DeliveryDate').enable();
    row.get('Price').enable();
    row.get('PaymentTerms').enable();
    row.get('Schedule').enable();
    row.get('SupplierPartNumber').enable();
    row.get('SelfLifeDays').enable();
    this.RFQResponseItemFormArray.push(row);
    this.RFQResponseItemDataSource.next(this.RFQResponseItemFormArray.controls);
    if (RFQItem.IsResponded) {
      this.selection.toggle(row);
    }
    // return row;
  }

  handleFileInput(evt, index: number): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUpload = evt.target.files[0];
      this.fileToUploadList.push(this.fileToUpload);
      const OldValue = +this.RFQResponseItemFormArray.controls[index].get('NumberOfAttachments').value;
      this.RFQResponseItemFormArray.controls[index].get('NumberOfAttachments').patchValue(OldValue + 1);
      const AttNames = this.RFQResponseItemFormArray.controls[index].get('AttachmentNames').value as string[];
      AttNames.push(this.fileToUpload.name);
      this.RFQResponseItemFormArray.controls[index].get('AttachmentNames').patchValue(AttNames);
    }
  }

  onKeydown(event): boolean {
    // console.log(event.key);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return true;
    } else {
      return false;
    }
  }
  DateSelected(event, row: FormGroup): void {
    // console.log(event.value);
    // console.log(row.get('ExpectedDeliveryDate').value);
    const DeliveryDateValue = new Date(event.value);
    const ExpectedDeliveryDateValue = new Date(row.get('ExpectedDeliveryDate').value);
    const diff = DeliveryDateValue.getTime() - ExpectedDeliveryDateValue.getTime();
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    if (diffDays < 0) {
      diffDays = 0;
      row.get('DeliveryDate').patchValue(ExpectedDeliveryDateValue);
      this.notificationSnackBarComponent.openSnackBar('Should not be less than expected delivery date', SnackBarStatus.danger);
    }
    row.get('DelayDays').patchValue(diffDays);
  }

  ValidateRFQResponse(): void {
    if (this.selection.selected && this.selection.selected.length && this.selection.selected.length > 0) {
      // this.RFQResponseFormGroup.enable();
      this.AddValidatorToFormArray();
      if (this.RFQResponseFormGroup.valid) {
        if (this.RFQ.RFQResponseStatus.toLocaleLowerCase() === 'responded') {
          // const Actiontype = 'Update';
          // const Catagory = 'RFQ Response';
          const Actiontype = 'Response';
          const Catagory = 'RFQ';
          this.OpenConfirmationDialog(Actiontype, Catagory);
        } else {
          // const Actiontype = 'Create';
          // const Catagory = 'RFQ Response';
          const Actiontype = 'Response';
          const Catagory = 'RFQ';
          this.OpenConfirmationDialog(Actiontype, Catagory);
        }
      } else {
        this.ShowValidationErrors();
      }
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select atleast one item', SnackBarStatus.danger);
    }

  }

  AddValidatorToFormArray(): void {
    const RFQResponseItemsFormArray = this.selection.selected as AbstractControl[];
    RFQResponseItemsFormArray.forEach((xy, i) => {
      const x = xy as FormGroup;
      x.get('Manufacturer').setValidators([Validators.required]);
      x.get('Manufacturer').updateValueAndValidity();
      x.get('DeliveryDate').setValidators([Validators.required]);
      x.get('DeliveryDate').updateValueAndValidity();
      x.get('Schedule').setValidators([Validators.required]);
      x.get('Schedule').updateValueAndValidity();
      x.get('Price').setValidators([Validators.required]);
      x.get('Price').updateValueAndValidity();
      x.get('PaymentTerms').setValidators([Validators.required]);
      x.get('PaymentTerms').updateValueAndValidity();
      x.get('SupplierPartNumber').setValidators([Validators.required]);
      x.get('SupplierPartNumber').updateValueAndValidity();
      x.get('SelfLifeDays').setValidators([Validators.required]);
      x.get('SelfLifeDays').updateValueAndValidity();
    });
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
    if (this.RFQ.RFQResponseStatus.toLocaleLowerCase() === 'responded') {
      this.UpdateRFQResponse();
    } else {
      this.CreateRFQResponse();
    }
  }

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
    // this.RFQResponse.PurchaseRequisitionID = this.SelectedPurchaseRequisitionID;
    this.RFQResponse.RFQID = this.RFQ.RFQID;
    this.RFQResponse.VendorID = this.SelectedVendorID;
    this.RFQResponse.Name = this.RFQResponseFormGroup.get('Name').value;
    this.RFQResponse.Email = this.RFQResponseFormGroup.get('Email').value;
    this.RFQResponse.ContactNumber = this.RFQResponseFormGroup.get('ContactNumber').value;
    this.RFQResponse.BankGuarantee = this.RFQResponseFormGroup.get('BankGuarantee').value;
    this.RFQResponse.UserID = this.authenticationDetails.userID;
  }

  GetRFQResponseItems(): void {
    this.RFQResponse.RFQResponseItems = [];
    const RFQResponseItemsFormArray = this.RFQResponseFormGroup.get('RFQResponseItems') as FormArray;
    RFQResponseItemsFormArray.controls.forEach((x, i) => {
      const rfq: RFQResponseItemView = new RFQResponseItemView();
      rfq.IsResponded = x.get('IsResponded').value;
      rfq.ItemID = x.get('ItemID').value;
      rfq.MaterialDescription = x.get('MaterialDescription').value;
      rfq.Manufacturer = x.get('Manufacturer').value;
      rfq.OrderQuantity = x.get('OrderQuantity').value;
      rfq.DelayDays = x.get('DelayDays').value;
      rfq.UOM = x.get('UOM').value;
      rfq.Price = x.get('Price').value;
      rfq.PaymentTerms = x.get('PaymentTerms').value;
      rfq.SupplierPartNumber = x.get('SupplierPartNumber').value;
      rfq.Schedule = x.get('Schedule').value;
      rfq.ExpectedDeliveryDate = x.get('ExpectedDeliveryDate').value;
      rfq.DeliveryDate = new Date(this._datePipe.transform(x.get('DeliveryDate').value, 'yyyy-MM-dd'));
      rfq.SelfLifeDays = x.get('SelfLifeDays').value;
      rfq.NumberOfAttachments = x.get('NumberOfAttachments').value;
      rfq.AttachmentNames = x.get('AttachmentNames').value;
      rfq.TechRating = x.get('TechRating').value;
      rfq.Notes = x.get('Notes').value;
      rfq.APPID = this.RFQResponseItemAppID;
      this.RFQResponse.RFQResponseItems.push(rfq);
    });
  }

  CreateRFQResponse(): void {
    this.IsProgressBarVisibile = true;
    // this.GetRFQHeaderValues();
    this.GetRFQResponseHeaderValues();
    this.GetRFQResponseItems();
    this.RFQResponse.CreatedBy = this.CurrentUserID.toString();
    this._rfqService.CreateRFQResponse(this.RFQResponse).subscribe(
      (data) => {
        const TransID = data as number;
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('RFQ Response details created successfully', SnackBarStatus.success);
        this.ResetControl();
        this._router.navigate(['/rfq/rfqvendor']);
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
    this.RFQResponse.ModifiedBy = this.CurrentUserID.toString();
    this._rfqService.UpdateRFQResponse(this.RFQResponse).subscribe(
      (data) => {
        const TransID = data as number;
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('RFQ Response details updated successfully', SnackBarStatus.success);
        this.ResetControl();
        this._router.navigate(['/rfq/rfqvendor']);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        this.ResetControl();
      }
    );
  }
  GetRFQItemAttachments(index: number): void {
    const RFQItemsFormArray = this.RFQResponseFormGroup.get('RFQResponseItems') as FormArray;
    const APPNumber: number = RFQItemsFormArray.controls[index].get('ItemID').value;
    this._rfqService.GetRFQItemAttachments(this.RFQItemAppID, APPNumber, this.RFQ.RFQID.toString()).subscribe(
      (data) => {
        if (data) {
          const dat = data as AuxiliaryView[];
          this.OpenForgetPasswordLinkDialog(dat);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
  OpenForgetPasswordLinkDialog(data: AuxiliaryView[]): void {
    const dialogConfig: MatDialogConfig = {
      data: data,
      panelClass: 'attachment-dialog'
    };
    const dialogRef = this.dialog.open(AttachmentsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {

        }
      });
  }
  // GetRFQByPurchaseRequisitionID(): void {
  //   this._rfqService.GetRFQByPurchaseRequisitionID(this.SelectedPurchaseRequisitionID).subscribe(
  //     (data) => {
  //       this.RFQ = data as RFQView;
  //       if (this.RFQ) {
  //         this.InsertRFQHeaderValues();
  //         this.RFQResponseFormGroup.disable();
  //         if (this.RFQ.RFQItems && this.RFQ.RFQItems.length) {
  //           this.ClearFormArray(this.RFQResponseItemFormArray);
  //           this.RFQ.RFQItems.forEach((x, i) => {
  //             this.InsertRFQResponseItemsFormGroup(x);
  //           });
  //         } else {
  //           this.ResetRFQResponseItems();
  //         }

  //       }
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );
  // }
  OpenTermsAndCondtionsDialog(): void {
    const dialogConfig: MatDialogConfig = {
      panelClass: 'terms-conditions-dialog'
    };
    const dialogRef = this.dialog.open(TermsAndConditionsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {

        }
      });
  }

  onChangeChk($event, data: AbstractControl): void {
    // $event.source.checked = !$event.source.checked;
    this.selection.toggle(data);
  }
}
