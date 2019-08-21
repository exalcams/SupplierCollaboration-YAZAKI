import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
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
import { RFQAllocationView } from 'app/models/rfq.model';

@Component({
  selector: 'evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  CurrentUserName: string;
  SelectedPurchaseRequisitionID: number;
  SelectedRFQStatus = '';
  SelectedRFQID: number;
  RFQAllocations: RFQAllocationView[] = [];
  VendorSearchFormGroup: FormGroup;
  conditions: VendorSearchCondition;
  VendorList: Vendor[] = [];
  SelectedVendorList: Vendor[] = [];
  CheckedVendorList: Vendor[] = [];
  BGClassName: any;
  vendorDisplayedColumns: string[] = ['select', 'VendorCode', 'VendorName', 'GSTNumber', 'Type', 'City', 'State'];
  vendorDataSource: MatTableDataSource<Vendor>;
  selection = new SelectionModel<Vendor>(true, []);
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
  ) {
    const CurrentPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    console.log(CurrentPurchaseRequisition);
    if (CurrentPurchaseRequisition) {
      this.SelectedPurchaseRequisitionID = CurrentPurchaseRequisition.PurchaseRequisitionID;
      this.SelectedRFQID = CurrentPurchaseRequisition.RFQID;
      this.SelectedRFQStatus = CurrentPurchaseRequisition.RFQStatus;
    } else {
      this._router.navigate(['/rfq/publish']);
    }
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.conditions = new VendorSearchCondition();
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.VendorSearchFormGroup = this._formBuilder.group({
      VendorCode: [''],
      VendorName: [''],
      GSTNumber: [''],
      State: [''],
      Type: [''],
    });
    this.GetAllVendors();
    if (this.SelectedRFQStatus.toLocaleLowerCase() === 'inprogress') {
      this.GetRFQAllocationTempByRFQID();
    }
    if (this.SelectedRFQStatus.toLocaleLowerCase() === 'completed') {
      this.GetRFQAllocationByRFQID();
    }
    this.isAllSelected();
    this.masterToggle();
    this.checkboxLabel();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }

  ResetControl(): void {
    this.conditions = new VendorSearchCondition();
    this.VendorSearchFormGroup.reset();
    Object.keys(this.VendorSearchFormGroup.controls).forEach(key => {
      this.VendorSearchFormGroup.get(key).markAsUntouched();
    });
    this.SelectedVendorList = [];
    this.ResetCheckbox();
  }

  ResetCheckbox(): void {
    this.selection.clear();
    this.vendorDataSource.data.forEach(row => this.selection.deselect(row));

  }

  GetAllVendors(): void {
    this.IsProgressBarVisibile = true;
    this._masterService.GetAllVendors().subscribe(
      (data) => {
        this.VendorList = data as Vendor[];
        this.vendorDataSource = new MatTableDataSource(this.VendorList);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  GetRFQAllocationTempByRFQID(): void {
    this.IsProgressBarVisibile = true;
    this._rfqService.GetRFQAllocationTempByRFQID(this.SelectedRFQID).subscribe(
      (data) => {
        if (data && data.length > 0) {
          const rFQAllocationViews = data as RFQAllocationView[];
          const VendorCodes = rFQAllocationViews.map(x => x.VendorID);
          this._masterService.GetVendorsByVendorCodes(VendorCodes).subscribe(
            (data1) => {
              const AlreadySelectedVendors = data1 as Vendor[];
              if (AlreadySelectedVendors && AlreadySelectedVendors.length) {
                this.SelectedVendorList = AlreadySelectedVendors;
              }
              this.IsProgressBarVisibile = false;
            },
            (err1) => {
              console.error(err1);
              this.IsProgressBarVisibile = false;
            }
          );
        } else {
          this.IsProgressBarVisibile = false;
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  GetRFQAllocationByRFQID(): void {
    this.IsProgressBarVisibile = true;
    this._rfqService.GetRFQAllocationByRFQID(this.SelectedRFQID).subscribe(
      (data) => {
        if (data && data.length > 0) {
          const rFQAllocationViews = data as RFQAllocationView[];
          const VendorCodes = rFQAllocationViews.map(x => x.VendorID);
          this._masterService.GetVendorsByVendorCodes(VendorCodes).subscribe(
            (data1) => {
              const AlreadySelectedVendors = data1 as Vendor[];
              if (AlreadySelectedVendors && AlreadySelectedVendors.length) {
                this.SelectedVendorList = AlreadySelectedVendors;
              }
              this.IsProgressBarVisibile = false;
            },
            (err1) => {
              console.error(err1);
              this.IsProgressBarVisibile = false;
            }
          );
        } else {
          this.IsProgressBarVisibile = false;
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  GetVendorsBasedOnConditions(): void {
    if (this.VendorSearchFormGroup.valid) {
      this.CheckedVendorList = [];
      this.ResetCheckbox();
      this.IsProgressBarVisibile = true;
      this.conditions.VendorCode = this.VendorSearchFormGroup.get('VendorCode').value;
      this.conditions.VendorName = this.VendorSearchFormGroup.get('VendorName').value;
      this.conditions.GSTNumber = this.VendorSearchFormGroup.get('GSTNumber').value;
      this.conditions.State = this.VendorSearchFormGroup.get('State').value;
      this.conditions.Type = this.VendorSearchFormGroup.get('Type').value;
      this._masterService.GetVendorsBasedOnConditions(this.conditions).subscribe(
        (data) => {
          this.VendorList = data as Vendor[];
          this.vendorDataSource = new MatTableDataSource(this.VendorList);
          this.IsProgressBarVisibile = false;
        },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
        }
      );
    } else {
      Object.keys(this.VendorSearchFormGroup.controls).forEach(key => {
        this.VendorSearchFormGroup.get(key).markAsTouched();
        this.VendorSearchFormGroup.get(key).markAsDirty();
      });
    }
  }

  // CheckBoxEvent(event: any, selectedVendor: Vendor): void {
  //   if (event.checked) {
  //     this.CheckedVendorList.push(selectedVendor);
  //   } else {
  //     const index = this.CheckedVendorList.findIndex(x => x.ID === selectedVendor.ID);
  //     if (index >= 0) {
  //       this.CheckedVendorList.splice(index, 1);
  //     }
  //   }
  // }

  AddSelectedVendors(): void {
    // if (this.CheckedVendorList && this.CheckedVendorList.length) {
    //   this.CheckedVendorList.forEach(x => {
    //     const index = this.SelectedVendorList.findIndex(y => y.ID === x.ID);
    //     if (index < 0) {
    //       this.SelectedVendorList.push(x);
    //     }
    //   });
    // } else {
    //   this.notificationSnackBarComponent.openSnackBar('no items selected', SnackBarStatus.warning);
    // }
    if (this.selection && this.selection.selected.length) {
      this.selection.selected.forEach(x => {
        const index = this.SelectedVendorList.findIndex(y => y.ID === x.ID);
        if (index < 0) {
          this.SelectedVendorList.push(x);
        }
      });
    } else {
      this.notificationSnackBarComponent.openSnackBar('no items selected', SnackBarStatus.warning);
    }

  }
  RemoveSelectedVendor(VendorCode: string): void {
    const indexx = this.SelectedVendorList.findIndex(x => x.VendorCode === VendorCode);
    if (indexx >= 0) {
      this.SelectedVendorList.splice(indexx, 1);
    }
  }

  CreateRFQAllocation(): void {
    if (this.SelectedVendorList && this.SelectedVendorList.length) {
      this.IsProgressBarVisibile = true;
      this.RFQAllocations = [];
      this.SelectedVendorList.forEach(x => {
        const rFQAllocationView: RFQAllocationView = new RFQAllocationView();
        rFQAllocationView.PurchaseRequisitionID = this.SelectedPurchaseRequisitionID;
        rFQAllocationView.RFQID = this.SelectedRFQID;
        rFQAllocationView.VendorID = x.VendorCode;
        rFQAllocationView.CreatedBy = this.CurrentUserName;
        this.RFQAllocations.push(rFQAllocationView);
      });
      this._rfqService.CreateRFQAllocation(this.RFQAllocations).subscribe(
        (data) => {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Allocation created successfully', SnackBarStatus.success);
          this.ResetControl();
          this._router.navigate(['/rfq/publish']);
        },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        }
      );
    } else {
      this.notificationSnackBarComponent.openSnackBar('no vendor is added', SnackBarStatus.warning);
    }
  }

  SaveRFQAllocationTemp(): void {
    if (this.SelectedVendorList && this.SelectedVendorList.length) {
      this.IsProgressBarVisibile = true;
      this.RFQAllocations = [];
      this.SelectedVendorList.forEach(x => {
        const rFQAllocationView: RFQAllocationView = new RFQAllocationView();
        rFQAllocationView.PurchaseRequisitionID = this.SelectedPurchaseRequisitionID;
        rFQAllocationView.RFQID = this.SelectedRFQID;
        rFQAllocationView.VendorID = x.VendorCode;
        rFQAllocationView.CreatedBy = this.CurrentUserName;
        this.RFQAllocations.push(rFQAllocationView);
      });
      this._rfqService.SaveRFQAllocationTemp(this.RFQAllocations).subscribe(
        (data) => {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Allocation saved successfully', SnackBarStatus.success);
          this.ResetControl();
          this._router.navigate(['/rfq/publish']);
        },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        }
      );
    } else {
      this.notificationSnackBarComponent.openSnackBar('no vendor is added', SnackBarStatus.warning);
    }
  }

  radioChange(event: any): void {
    console.log(event);
  }

  isAllSelected(): boolean {
    // const numSelected = this.selection.selected.length;
    // const numRows = this.vendorDataSource.data.length;
    // return numSelected === numRows;
    return true;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    // this.isAllSelected() ?
    //   this.selection.clear() :
    //   this.vendorDataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Vendor): string {
    // if (!row) {
    //   return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    // }
    // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.GSTNumber + 1}`;
    return '';
  }

}

