import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorSearchCondition, Vendor, AuthenticationDetails } from 'app/models/master';
import { MasterService } from 'app/services/master.service';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { ShareParameterService } from 'app/services/share-parameter.service';
import { Router } from '@angular/router';
import { RFQService } from 'app/services/rfq.service';
import { RFQAllocationView, PurchaseRequisitionStatusCount, RFQStatusCount } from 'app/models/rfq.model';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
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
  compStyles: CSSStyleDeclaration;
  vendorDisplayedColumns: string[] = ['select', 'VendorCode', 'VendorName', 'GSTNumber', 'City', 'State', 'AccountGroup'];
  vendorDataSource: MatTableDataSource<Vendor>;
  selection = new SelectionModel<Vendor>(true, []);
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  purchaseRequisitionStatusCount: PurchaseRequisitionStatusCount;
  IsSearchShow: boolean;
  rfqStatusCount: RFQStatusCount;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _masterService: MasterService,
    private _shareParameterService: ShareParameterService,
    private _rfqService: RFQService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    const CurrentPurchaseRequisition = this._shareParameterService.GetPurchaseRequisition();
    // console.log(CurrentPurchaseRequisition);
    if (CurrentPurchaseRequisition) {
      this.SelectedPurchaseRequisitionID = CurrentPurchaseRequisition.PurchaseRequisitionID;
      this.SelectedRFQID = CurrentPurchaseRequisition.RFQID;
      this.SelectedRFQStatus = CurrentPurchaseRequisition.RFQStatus;
    } else {
      this._router.navigate(['/rfq/pr']);
    }
    this.IsProgressBarVisibile = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.conditions = new VendorSearchCondition();
    this.purchaseRequisitionStatusCount = new PurchaseRequisitionStatusCount();
    this.rfqStatusCount = new RFQStatusCount();
    this.IsSearchShow = true;
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('RFQPublish') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.VendorSearchFormGroup = this._formBuilder.group({
      VendorCode: [''],
      VendorName: [''],
      GSTNumber: [''],
      State: [''],
      City: [''],
      AccountGroup: [''],
      EmailId: [''],
      ContactNumber: [],
    });
    // this.GetAllVendors();
    this.GetVendorsBasedOnMaterial();
    // this.GetPurchaseRequisitionStatusCount();
    this.GetRFQStatusCount();
    if (this.SelectedRFQStatus.toLocaleLowerCase() === 'inprogress') {
      this.GetRFQAllocationTempByRFQID();
    }
    if (this.SelectedRFQStatus.toLocaleLowerCase() === 'allocated') {
      this.GetRFQAllocationByRFQID();
    }
    this.isAllSelected();
    this.masterToggle();
    this.checkboxLabel();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
        const backgroundElement = document.querySelector(`.${this.BGClassName.layout.toolbar.background}`);
        this.compStyles = window.getComputedStyle(backgroundElement);
      });
  }
  ResetForm(): void {
    this.VendorSearchFormGroup.reset();
    Object.keys(this.VendorSearchFormGroup.controls).forEach(key => {
      this.VendorSearchFormGroup.get(key).markAsUntouched();
    });
  }
  ResetControl(): void {
    this.ResetForm();
    this.conditions = new VendorSearchCondition();
    this.SelectedVendorList = [];
    this.ResetCheckbox();
  }

  ResetCheckbox(): void {
    this.selection.clear();
    if (this.vendorDataSource && this.vendorDataSource.data) {
      this.vendorDataSource.data.forEach(row => this.selection.deselect(row));
    }
  }

  GetPurchaseRequisitionStatusCount(): void {
    this._rfqService.GetPurchaseRequisitionStatusCount().subscribe(
      (data) => {
        this.purchaseRequisitionStatusCount = data as PurchaseRequisitionStatusCount;
      },
      (err) => {
        console.error(err);
      }
    );
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

  GetAllVendors(): void {
    this.IsProgressBarVisibile = true;
    this._masterService.GetAllVendors().subscribe(
      (data) => {
        this.VendorList = data as Vendor[];
        // this.VendorList.forEach(x => {
        //   x.VendorCode = x.VendorCode.replace(/^0+/, '');
        // });
        this.vendorDataSource = new MatTableDataSource(this.VendorList);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  GetVendorsBasedOnMaterial(): void {
    this.IsProgressBarVisibile = true;
    this._masterService.GetVendorsBasedOnMaterial(this.SelectedRFQID).subscribe(
      (data) => {
        this.VendorList = data as Vendor[];
        // this.VendorList.forEach(x => {
        //   x.VendorCode = x.VendorCode.replace(/^0+/, '');
        // });
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
      this.conditions.City = this.VendorSearchFormGroup.get('City').value;
      this.conditions.AccountGroup = this.VendorSearchFormGroup.get('AccountGroup').value;
      this._masterService.GetVendorsBasedOnConditions(this.conditions).subscribe(
        (data) => {
          this.VendorList = data as Vendor[];
          // this.VendorList.forEach(x => {
          //   x.VendorCode = x.VendorCode.replace(/^0+/, '');
          // });
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

  AddVendorClicked(): void {
    this.IsSearchShow = !this.IsSearchShow;
    this.ResetForm();
    if (!this.IsSearchShow) {
      // this.ResetControl();
      this.AddValidators();
    } else {
      // this.ResetControl();
      this.RemoveValidators();
    }
  }
  AddValidators(): void {
    // this.VendorSearchFormGroup.get('VendorCode').setValidators([Validators.required]);
    // this.VendorSearchFormGroup.get('VendorCode').updateValueAndValidity();
    this.VendorSearchFormGroup.get('VendorName').setValidators([Validators.required]);
    this.VendorSearchFormGroup.get('VendorName').updateValueAndValidity();
    this.VendorSearchFormGroup.get('GSTNumber').setValidators([Validators.required]);
    this.VendorSearchFormGroup.get('GSTNumber').updateValueAndValidity();
    this.VendorSearchFormGroup.get('State').setValidators([Validators.required]);
    this.VendorSearchFormGroup.get('State').updateValueAndValidity();
    this.VendorSearchFormGroup.get('City').setValidators([Validators.required]);
    this.VendorSearchFormGroup.get('City').updateValueAndValidity();
    this.VendorSearchFormGroup.get('AccountGroup').setValidators([Validators.required]);
    this.VendorSearchFormGroup.get('AccountGroup').updateValueAndValidity();
    this.VendorSearchFormGroup.get('EmailId').setValidators([Validators.required, Validators.email]);
    this.VendorSearchFormGroup.get('EmailId').updateValueAndValidity();
    this.VendorSearchFormGroup.get('ContactNumber').setValidators([Validators.required]);
    this.VendorSearchFormGroup.get('ContactNumber').updateValueAndValidity();
  }
  RemoveValidators(): void {
    this.VendorSearchFormGroup.get('VendorCode').clearValidators();
    this.VendorSearchFormGroup.get('VendorCode').updateValueAndValidity();
    this.VendorSearchFormGroup.get('VendorName').clearValidators();
    this.VendorSearchFormGroup.get('VendorName').updateValueAndValidity();
    this.VendorSearchFormGroup.get('GSTNumber').clearValidators();
    this.VendorSearchFormGroup.get('GSTNumber').updateValueAndValidity();
    this.VendorSearchFormGroup.get('State').clearValidators();
    this.VendorSearchFormGroup.get('State').updateValueAndValidity();
    this.VendorSearchFormGroup.get('City').clearValidators();
    this.VendorSearchFormGroup.get('City').updateValueAndValidity();
    this.VendorSearchFormGroup.get('AccountGroup').clearValidators();
    this.VendorSearchFormGroup.get('AccountGroup').updateValueAndValidity();
    this.VendorSearchFormGroup.get('EmailId').clearValidators();
    this.VendorSearchFormGroup.get('EmailId').updateValueAndValidity();
    this.VendorSearchFormGroup.get('ContactNumber').clearValidators();
    this.VendorSearchFormGroup.get('ContactNumber').updateValueAndValidity();
  }
  SaveVendorsCliked(): void {
    if (this.VendorSearchFormGroup.valid) {
      const Actiontype = 'Create';
      const Catagory = 'Vendor';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      Object.keys(this.VendorSearchFormGroup.controls).forEach(key => {
        this.VendorSearchFormGroup.get(key).markAsTouched();
        this.VendorSearchFormGroup.get(key).markAsDirty();
      });
    }
  }

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

  SubmitRFQAllocation(): void {
    if (this.SelectedVendorList && this.SelectedVendorList.length) {
      const Actiontype = 'Submit';
      const Catagory = 'RFQ Allocation';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.notificationSnackBarComponent.openSnackBar('no vendor is added', SnackBarStatus.warning);
    }
  }

  SaveRFQAllocation(): void {
    if (this.SelectedVendorList && this.SelectedVendorList.length) {
      const Actiontype = 'Save';
      const Catagory = 'RFQ Allocation';
      this.OpenConfirmationDialog(Actiontype, Catagory);
    } else {
      this.notificationSnackBarComponent.openSnackBar('no vendor is added', SnackBarStatus.warning);
    }
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
          if (Actiontype === 'Submit') {
            this.CreateRFQAllocation();
          }
          else if (Actiontype === 'Save') {
            this.CreateRFQAllocationTemp();
          }
          else if (Actiontype === 'Create') {
            this.CreateVendor();
          }
        }
      });
  }

  CreateRFQAllocation(): void {
    this.GetRFQAllocationDetails();
    this.IsProgressBarVisibile = true;
    this._rfqService.CreateRFQAllocation(this.RFQAllocations).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Allocation created successfully', SnackBarStatus.success);
        this.ResetControl();
        this._router.navigate(['/rfq/pr']);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  CreateRFQAllocationTemp(): void {
    this.GetRFQAllocationDetails();
    this.IsProgressBarVisibile = true;
    this._rfqService.CreateRFQAllocationTemp(this.RFQAllocations).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Allocation saved successfully', SnackBarStatus.success);
        this.ResetControl();
        this._router.navigate(['/rfq/pr']);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  CreateVendor(): void {
    const ven = new Vendor();
    ven.VendorCode = this.VendorSearchFormGroup.get('VendorCode').value;
    ven.VendorName = this.VendorSearchFormGroup.get('VendorName').value;
    ven.GSTNumber = this.VendorSearchFormGroup.get('GSTNumber').value;
    ven.State = this.VendorSearchFormGroup.get('State').value;
    ven.City = this.VendorSearchFormGroup.get('City').value;
    ven.EmailId = this.VendorSearchFormGroup.get('EmailId').value;
    ven.ContactNumber = this.VendorSearchFormGroup.get('ContactNumber').value;
    ven.AccountGroup = this.VendorSearchFormGroup.get('AccountGroup').value;
    this.IsProgressBarVisibile = true;
    this._masterService.CreateVendor(ven).subscribe(
      (data) => {
        this.IsSearchShow = true;
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Vendor created successfully', SnackBarStatus.success);
        this.ResetForm();
        this.RemoveValidators();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetRFQAllocationDetails(): void {
    this.RFQAllocations = [];
    this.SelectedVendorList.forEach(x => {
      const rFQAllocationView: RFQAllocationView = new RFQAllocationView();
      rFQAllocationView.PurchaseRequisitionID = this.SelectedPurchaseRequisitionID;
      rFQAllocationView.RFQID = this.SelectedRFQID;
      rFQAllocationView.VendorID = x.VendorCode;
      rFQAllocationView.CreatedBy = this.CurrentUserID.toString();
      this.RFQAllocations.push(rFQAllocationView);
    });
  }

  radioChange(event: any): void {
    console.log(event);
  }

  isAllSelected(): boolean {
    if (this.selection && this.vendorDataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.vendorDataSource.data.length;
      return numSelected === numRows;
    }
    // return true;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    if (this.vendorDataSource) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.vendorDataSource.data.forEach(row => this.selection.select(row));
    }
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

