import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationDetails, Vendor, VendorSearchCondition, App } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { DocumentCollectionService } from 'app/services/document-collection.service';
import { CAPAHeader, CAPAAllocation } from 'app/models/document-collection.model';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { MasterService } from 'app/services/master.service';

@Component({
  selector: 'app-capa-assignment',
  templateUrl: './capa-assignment.component.html',
  styleUrls: ['./capa-assignment.component.scss']
})
export class CapaAssignmentComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  CAPA: CAPAHeader;
  CAPAFormGroup: FormGroup;
  fileToUpload: File;
  fileToUploadList: File[] = [];
  CAPAAppID: number;
  SelectedCAPAID: number;
  ShowCAPAAllocation: boolean;
  ShowCAPAAllocationTag: boolean;
  CAPAAllocations: CAPAAllocation[] = [];
  BGClassName: any;
  VendorSearchFormGroup: FormGroup;
  conditions: VendorSearchCondition;
  VendorList: Vendor[] = [];
  SelectedVendorList: Vendor[] = [];
  CheckedVendorList: Vendor[] = [];
  vendorDisplayedColumns: string[] = ['select', 'VendorCode', 'VendorName', 'GSTNumber', 'Type', 'City', 'State'];
  vendorDataSource: MatTableDataSource<Vendor>;
  selection = new SelectionModel<Vendor>(true, []);
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _documentCollectionService: DocumentCollectionService,
    private _masterService: MasterService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {
    this.CAPA = new CAPAHeader();
    this.conditions = new VendorSearchCondition();
    this.IsProgressBarVisibile = false;
    this.ShowCAPAAllocation = false;
    this.ShowCAPAAllocationTag = false;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('CAPACreation') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }

    this.CAPAFormGroup = this._formBuilder.group({
      Title: ['', Validators.required],
      LongText: ['', Validators.required],
      DueDate: ['', Validators.required],
    });

    this.VendorSearchFormGroup = this._formBuilder.group({
      VendorCode: [''],
      VendorName: [''],
      GSTNumber: [''],
      State: [''],
      // Type: [''],
    });
    this.GetAppByName();
    // this.GetAllVendors();
    this.isAllSelected();
    this.masterToggle();
    this.checkboxLabel();
    this._fuseConfigService.config.subscribe((config) => {
      this.BGClassName = config;
    });
  }

  ResetControl(): void {
    this.CAPA = new CAPAHeader();
    this.conditions = new VendorSearchCondition();
    this.CAPAFormGroup.reset();
    Object.keys(this.CAPAFormGroup.controls).forEach(key => {
      this.CAPAFormGroup.get(key).markAsUntouched();
    });
    this.VendorSearchFormGroup.reset();
    Object.keys(this.VendorSearchFormGroup.controls).forEach(key => {
      this.VendorSearchFormGroup.get(key).markAsUntouched();
    });
    this.SelectedVendorList = [];
    this.ResetCheckbox();
    if (!this.ShowCAPAAllocationTag) {
      this.ShowCAPAAllocation = false;
    }
    this.fileToUploadList = [];
    this.fileToUpload = null;
  }
  ResetCheckbox(): void {
    this.selection.clear();
    if (this.vendorDataSource) {
      this.vendorDataSource.data.forEach(row => this.selection.deselect(row));
    }
  }

  GetAppByName(): void {
    const AppName = 'CAPA';
    this._masterService.GetAppByName(AppName).subscribe(
      (data) => {
        const ASNAPP = data as App;
        if (ASNAPP) {
          this.CAPAAppID = ASNAPP.AppID;
        }
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
        this.vendorDataSource = new MatTableDataSource(this.VendorList);
        this.IsProgressBarVisibile = false;
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
      // this.conditions.Type = this.VendorSearchFormGroup.get('Type').value;
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

  handleFileInput(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.fileToUploadList = [];
      this.fileToUpload = evt.target.files[0];
      this.fileToUploadList.push(this.fileToUpload);
    }
  }

  GetCAPAHeaderValues(): void {
    this.CAPA.Title = this.CAPAFormGroup.get('Title').value;
    this.CAPA.LongText = this.CAPAFormGroup.get('LongText').value;
    this.CAPA.DueDate = this.CAPAFormGroup.get('DueDate').value;
    this.CAPA.CreatedBy = this.CurrentUserName;
  }

  SaveCAPA(): void {
    this.ShowCAPAAllocationTag = false;
    this.CreateCAPA();
  }

  CreateAndAssignCAPA(): void {
    this.ShowCAPAAllocationTag = true;
    this.CreateCAPA();
  }

  CreateCAPA(): void {
    if (this.CAPAFormGroup.valid) {
      if (this.CAPA.CAPAID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'CAPA Details'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.IsProgressBarVisibile = true;
              this.GetCAPAHeaderValues();
              this.CAPA.ModifiedBy = this.CurrentUserName;
              this._documentCollectionService.UpdateCAPA(this.CAPA, this.CAPAAppID, this.fileToUpload).subscribe(
                (data) => {
                  this.IsProgressBarVisibile = false;
                  this.notificationSnackBarComponent.openSnackBar('CAPA details updated successfully', SnackBarStatus.success);
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
            Catagory: 'CAPA Details'
          },
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.IsProgressBarVisibile = true;
              this.GetCAPAHeaderValues();
              this.CAPA.CreatedBy = this.CurrentUserName;
              this._documentCollectionService.CreateCAPA(this.CAPA, this.CAPAAppID, this.fileToUpload).subscribe(
                (data) => {
                  const CAPAID = data as number;
                  this.SelectedCAPAID = CAPAID;
                  this.IsProgressBarVisibile = false;
                  if (this.ShowCAPAAllocationTag) {
                    this.ShowCAPAAllocation = true;
                    this.GetAllVendors();
                  }
                  this.notificationSnackBarComponent.openSnackBar('CAPA details created successfully', SnackBarStatus.success);
                  this.ResetControl();
                },
                (err) => {
                  console.error(err);
                  this.IsProgressBarVisibile = false;
                  this.ShowCAPAAllocation = false;
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  // this.ResetControl();
                }
              );
            }
          });
      }
    } else {
      Object.keys(this.CAPAFormGroup.controls).forEach(key => {
        if (!this.CAPAFormGroup.get(key).valid) {
          console.log(key);
        }
        this.CAPAFormGroup.get(key).markAsTouched();
        this.CAPAFormGroup.get(key).markAsDirty();
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

  CreateCAPAAllocation(): void {
    if (this.SelectedVendorList && this.SelectedVendorList.length) {
      this.IsProgressBarVisibile = true;
      this.CAPAAllocations = [];
      this.SelectedVendorList.forEach(x => {
        const CAPAAllocationView: CAPAAllocation = new CAPAAllocation();
        CAPAAllocationView.CAPAID = this.SelectedCAPAID;
        CAPAAllocationView.VendorID = x.VendorCode;
        CAPAAllocationView.CreatedBy = this.CurrentUserName;
        this.CAPAAllocations.push(CAPAAllocationView);
      });
      this._documentCollectionService.CreateCAPAAllocation(this.CAPAAllocations).subscribe(
        (data) => {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Allocation created successfully', SnackBarStatus.success);
          this.ShowCAPAAllocationTag = false;
          this.ResetControl();
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
export class SupplierInviteClass {
  VendorName: string;
  GSTNumber: string;
  VendorType: string;
  City: string;
}
