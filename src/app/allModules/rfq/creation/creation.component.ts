import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { RFQView, RFQItem } from 'app/models/rfq.model';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AuthenticationDetails } from 'app/models/master';
import { Router, ActivatedRoute } from '@angular/router';
import { RFQService } from 'app/services/rfq.service';
import { Location } from '@angular/common';

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
  SelectedRFQStatus: string;
  RFQ: RFQView;
  BGClassName: any;
  RFQItemsColumns: string[] = ['ItemID', 'MaterialDescription', 'OrderQuantity', 'DelayDays', 'UOM', 'Price', 'SupplierPartNumber', 'Schedule', 'Attachment', 'TechRating'];
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private _rfqService: RFQService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.route.queryParams.subscribe(data => {
      this.SelectedPurchaseRequisitionID = +data['id'];
      this.SelectedRFQStatus = data['status'];
      if (!this.SelectedPurchaseRequisitionID) {
        this._router.navigate(['/rfq/publish']);
      }
    });
    // this._location.replaceState(this._router.url.split('?')[0]);
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.RFQ = new RFQView();
  }

  ngOnInit(): void {
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
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
    } else {
      this._router.navigate(['/auth/login']);
    }
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });

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
      // Schedule: ['', Validators.required],
      TechRating: ['', Validators.required],
    });
    this.RFQItemFormArray.push(row);
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
  AddRFQItem(): void {
    this.AddRFQItemFormGroup();
  }
  RemoveRFQItem(): void {
    if (this.RFQItemFormArray.length > 0) {
      this.RFQItemFormArray.removeAt(this.RFQItemFormArray.length - 1);
      this.RFQItemDataSource.next(this.RFQItemFormArray.controls);
    } else {
      this.notificationSnackBarComponent.openSnackBar('no items to delete', SnackBarStatus.warning);
    }
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
      const rfq: RFQItem = new RFQItem();
      rfq.ItemID = x.get('ItemID').value;
      rfq.MaterialDescription = x.get('MaterialDescription').value;
      rfq.OrderQuantity = x.get('OrderQuantity').value;
      rfq.DelayDays = x.get('DelayDays').value;
      rfq.UOM = x.get('UOM').value;
      rfq.Price = x.get('Price').value;
      // rfq.Schedule = x.get('Schedule').value;
      rfq.TechRating = x.get('TechRating').value;
      this.RFQ.RFQItems.push(rfq);
    });
  }

  SubmitRFQDetails(val: string): void {
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
              this.RFQ.Status = val;
              this.GetRFQHeaderValues();
              this.GetRFQItems();
              this.RFQ.ModifiedBy = this.CurrentUserName;
              this._rfqService.UpdateRFQ(this.RFQ).subscribe(
                (data) => {
                  this.IsProgressBarVisibile = false;
                  this.notificationSnackBarComponent.openSnackBar('RFQ details updated successfully', SnackBarStatus.success);
                  this.ResetControl();
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
              this.RFQ.Status = val;
              this.GetRFQHeaderValues();
              this.GetRFQItems();
              this.RFQ.CreatedBy = this.CurrentUserName;
              this._rfqService.CreateRFQ(this.RFQ).subscribe(
                (data) => {
                  this.IsProgressBarVisibile = false;
                  this.notificationSnackBarComponent.openSnackBar('RFQ details created successfully', SnackBarStatus.success);
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

  InsertRFQItemsFormGroup(rFQItem: RFQItem): void {
    const row = this._formBuilder.group({
      ItemID: [rFQItem.ItemID, Validators.required],
      MaterialDescription: [rFQItem.MaterialDescription, Validators.required],
      OrderQuantity: [rFQItem.OrderQuantity, Validators.required],
      DelayDays: [rFQItem.DelayDays, Validators.required],
      UOM: [rFQItem.UOM, Validators.required],
      Price: [rFQItem.Price, Validators.required],
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
