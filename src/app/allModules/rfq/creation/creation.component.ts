import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Renderer } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { RFQView, RFQItem, RFQItemView } from 'app/models/rfq.model';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AuthenticationDetails, App } from 'app/models/master';
import { Router, ActivatedRoute } from '@angular/router';
import { RFQService } from 'app/services/rfq.service';
import { Location } from '@angular/common';
import { Auxiliary } from 'app/models/asn';
import { MasterService } from 'app/services/master.service';
import { ShareParameterService } from 'app/services/share-parameter.service';

@Component({
  selector: 'creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  // animations: fuseAnimations
})
export class CreationComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  CurrentUserName: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  RFQFormGroup: FormGroup;
  RFQItemFormArray: FormArray = this._formBuilder.array([]);
  RFQItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  SelectedPurchaseRequisitionID: number;
  SelectedRFQStatus = '';
  RFQ: RFQView;
  BGClassName: any;
  RFQItemsColumns: string[] = ['ItemID', 'MaterialDescription', 'OrderQuantity', 'DelayDays', 'UOM', 'Price', 'SupplierPartNumber', 'Schedule', 'Attachment', 'TechRating'];
  RFQItemAppID: number;
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
    // this.route.queryParams.subscribe(data => {
    //   this.SelectedPurchaseRequisitionID = +data['id'];
    //   this.SelectedRFQStatus = data['status'];
    //   if (!this.SelectedPurchaseRequisitionID) {
    //     this._router.navigate(['/rfq/publish']);
    //   }
    // });
    const CurrentPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    // console.log(CurrentPurchaseRequisition);
    if (CurrentPurchaseRequisition) {
      this.SelectedPurchaseRequisitionID = CurrentPurchaseRequisition.PurchaseRequisitionID;
      this.SelectedRFQStatus = CurrentPurchaseRequisition.RFQStatus;
    } else {
      this._router.navigate(['/rfq/publish']);
    }


    // this._location.replaceState(this._router.url.split('?')[0]);
    // const url: string = this._router.url.substring(0, this._router.url.indexOf('?'));
    // this._router.navigateByUrl(url);
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.RFQ = new RFQView();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.RFQFormGroup = this._formBuilder.group({
      Title: ['', Validators.required],
      SupplyPlant: ['', Validators.required],
      Currency: ['', Validators.required],
      RFQStartDate: ['', Validators.required],
      RFQResponseStartDate: ['', Validators.required],
      IncoTerm: ['', Validators.required],
      RFQEndDate: ['', Validators.required],
      RFQResponseEndDate: ['', Validators.required],
      RFQItems: this.RFQItemFormArray
      // CreatedBy: ['', Validators.required]
    });
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
    this.GetAppByName();
    if (this.SelectedRFQStatus.toLocaleLowerCase() !== 'open') {
      this.GetRFQByPurchaseRequisitionID();
    }
  }
  AddRFQItemFormGroup(): void {
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
    this.RFQItemFormArray.push(row);
    // row.get('NumberOfAttachments').disable();
    this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
  }

  ResetControl(): void {
    this.RFQ = new RFQView();
    this.RFQFormGroup.reset();
    Object.keys(this.RFQFormGroup.controls).forEach(key => {
      this.RFQFormGroup.get(key).markAsUntouched();
    });
    this.ResetRFQItems();
  }
  ResetRFQItems(): void {
    this.ClearFormArray(this.RFQItemFormArray);
    this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  GetAppByName(): void {
    const AppName = 'RFQItem';
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

  AddRFQItem(): void {
    if (this.RFQFormGroup.enabled) {
      this.AddRFQItemFormGroup();
    }
  }
  RemoveRFQItem(): void {
    if (this.RFQFormGroup.enabled) {
      if (this.RFQItemFormArray.length > 0) {
        const AttNames = this.RFQItemFormArray.controls[this.RFQItemFormArray.length - 1].get('AttachmentNames').value as string[];
        // this.fileToUploadList = this.fileToUploadList.filter((el) =>
        //   !AttNames.includes(el.name)
        // );
        AttNames.forEach(x => {
          const indexx = this.fileToUploadList.map(y => y.name).indexOf(x);
          this.fileToUploadList.splice(indexx, 1);
        });
        this.RFQItemFormArray.removeAt(this.RFQItemFormArray.length - 1);
        this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
      } else {
        this.notificationSnackBarComponent.openSnackBar('no items to delete', SnackBarStatus.warning);
      }
    }
  }

  AddAttachments(): void {
    if (this.RFQFormGroup.enabled) {
      const event = new MouseEvent('click', { bubbles: true });
      this.renderer.invokeElementMethod(
        this.fileInput1.nativeElement, 'dispatchEvent', [event]);
    }
  }

  handleFileInput(evt, index: number): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUpload = evt.target.files[0];
      this.fileToUploadList.push(this.fileToUpload);
      const OldValue = +this.RFQItemFormArray.controls[index].get('NumberOfAttachments').value;
      this.RFQItemFormArray.controls[index].get('NumberOfAttachments').patchValue(OldValue + 1);
      const AttNames = this.RFQItemFormArray.controls[index].get('AttachmentNames').value as string[];
      AttNames.push(this.fileToUpload.name);
      this.RFQItemFormArray.controls[index].get('AttachmentNames').patchValue(AttNames);
    }
    // console.log(index);
  }

  GetRFQHeaderValues(): void {
    this.RFQ.Title = this.RFQFormGroup.get('Title').value;
    this.RFQ.SupplyPlant = this.RFQFormGroup.get('SupplyPlant').value;
    this.RFQ.Currency = this.RFQFormGroup.get('Currency').value;
    this.RFQ.RFQStartDate = this.RFQFormGroup.get('RFQStartDate').value;
    this.RFQ.RFQResponseStartDate = this.RFQFormGroup.get('RFQResponseStartDate').value;
    this.RFQ.IncoTerm = this.RFQFormGroup.get('IncoTerm').value;
    this.RFQ.RFQEndDate = this.RFQFormGroup.get('RFQEndDate').value;
    this.RFQ.RFQResponseEndDate = this.RFQFormGroup.get('RFQResponseEndDate').value;
  }

  GetRFQItems(): void {
    this.RFQ.RFQItems = [];
    const RFQItemsFormArray = this.RFQFormGroup.get('RFQItems') as FormArray;
    RFQItemsFormArray.controls.forEach((x, i) => {
      const rfq: RFQItemView = new RFQItemView();
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
      rfq.APPID = this.RFQItemAppID;
      this.RFQ.RFQItems.push(rfq);
    });
  }


  SubmitRFQDetails(): void {
    // this.RFQFormGroup.enable();
    if (this.RFQFormGroup.valid) {
      if (this.RFQ.RFQID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'RFQ Details'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.IsProgressBarVisibile = true;
              this.RFQ.PurchaseRequisitionID = this.SelectedPurchaseRequisitionID;
              this.GetRFQHeaderValues();
              this.GetRFQItems();
              this.RFQ.ModifiedBy = this.CurrentUserName;
              this._rfqService.UpdateRFQ(this.RFQ).subscribe(
                (data) => {
                  const TransID = data as number;
                  this.RFQ.RFQID = TransID;
                  const aux = new Auxiliary();
                  aux.APPID = this.RFQItemAppID;
                  aux.HeaderNumber = TransID.toString();
                  aux.CreatedBy = this.CurrentUserName;
                  if (this.fileToUploadList && this.fileToUploadList.length) {
                    this._rfqService.AddRFQAttachment(aux, this.fileToUploadList).subscribe(
                      (dat) => {
                        this.IsProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar('RFQ details updated successfully', SnackBarStatus.success);
                        this.GoToAllocateRFQ();
                        this.ResetControl();
                      },
                      (err) => {
                        console.error(err);
                        this.IsProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                      }
                    );
                  } else {
                    this.IsProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar('RFQ details updated successfully', SnackBarStatus.success);
                    this.GoToAllocateRFQ();
                    this.ResetControl();
                  }
                },
                (err) => {
                  console.error(err);
                  this.IsProgressBarVisibile = false;
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  this.ResetControl();
                }
              );
            } else {

            }
          }
        );
      } else {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Create',
            Catagory: 'RFQ Details'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.IsProgressBarVisibile = true;
              this.RFQ.PurchaseRequisitionID = this.SelectedPurchaseRequisitionID;
              this.GetRFQHeaderValues();
              this.GetRFQItems();
              this.RFQ.CreatedBy = this.CurrentUserName;
              this._rfqService.CreateRFQ(this.RFQ).subscribe(
                (data) => {
                  const TransID = data as number;
                  this.RFQ.RFQID = TransID;
                  const aux = new Auxiliary();
                  aux.APPID = this.RFQItemAppID;
                  aux.HeaderNumber = TransID.toString();
                  aux.CreatedBy = this.CurrentUserName;
                  if (this.fileToUploadList && this.fileToUploadList.length) {
                    this._rfqService.AddRFQAttachment(aux, this.fileToUploadList).subscribe(
                      (dat) => {
                        this.IsProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar('RFQ details created successfully', SnackBarStatus.success);
                        this.GoToAllocateRFQ();
                        this.ResetControl();
                      },
                      (err) => {
                        console.error(err);
                        this.IsProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                      }
                    );
                  } else {
                    this.IsProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar('RFQ details created successfully', SnackBarStatus.success);
                    this.GoToAllocateRFQ();
                    this.ResetControl();
                  }
                  // this.notificationSnackBarComponent.openSnackBar('RFQ details created successfully', SnackBarStatus.success);
                  // this.ResetControl();
                },
                (err) => {
                  console.error(err);
                  this.IsProgressBarVisibile = false;
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  // this.ResetControl();
                }
              );
            }
          });
      }
    } else {
      Object.keys(this.RFQFormGroup.controls).forEach(key => {
        if (!this.RFQFormGroup.get(key).valid) {
          console.log(key);
        }
        this.RFQFormGroup.get(key).markAsTouched();
        this.RFQFormGroup.get(key).markAsDirty();
        if (this.RFQFormGroup.get(key) instanceof FormArray) {
          const FormArrayControls = this.RFQFormGroup.get(key) as FormArray;
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
  }

  GoToAllocateRFQ(): void {
    const CurrentPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    CurrentPurchaseRequisition.RFQID = this.RFQ.RFQID;
    this._shareParameterService.SetPurchaseRequisition(CurrentPurchaseRequisition);
    this._router.navigate(['/rfq/evaluation']);
  }

  InsertRFQHeaderValues(): void {
    this.RFQFormGroup.patchValue({
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

  InsertRFQItemsFormGroup(rFQItem: RFQItemView): void {
    const row = this._formBuilder.group({
      ItemID: [rFQItem.ItemID, Validators.required],
      MaterialDescription: [rFQItem.MaterialDescription, Validators.required],
      OrderQuantity: [rFQItem.OrderQuantity, Validators.required],
      DelayDays: [rFQItem.DelayDays, Validators.required],
      UOM: [rFQItem.UOM, Validators.required],
      Price: [rFQItem.Price, Validators.required],
      Schedule: [rFQItem.Schedule, Validators.required],
      NumberOfAttachments: [rFQItem.NumberOfAttachments],
      AttachmentNames: [rFQItem.AttachmentNames],
      SupplierPartNumber: [rFQItem.SupplierPartNumber, Validators.required],
      TechRating: [rFQItem.TechRating, Validators.required],
    });
    this.RFQItemFormArray.push(row);
    this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
    // return row;
  }

  GetRFQByPurchaseRequisitionID(): void {
    this._rfqService.GetRFQByPurchaseRequisitionID(this.SelectedPurchaseRequisitionID).subscribe(
      (data) => {
        this.RFQ = data as RFQView;
        if (this.RFQ) {
          this.InsertRFQHeaderValues();
          if (this.RFQ.RFQItems && this.RFQ.RFQItems.length) {
            this.ClearFormArray(this.RFQItemFormArray);
            this.RFQ.RFQItems.forEach((x, i) => {
              this.InsertRFQItemsFormGroup(x);
            });
          } else {
            this.ResetRFQItems();
          }
          this.RFQFormGroup.disable();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

}
