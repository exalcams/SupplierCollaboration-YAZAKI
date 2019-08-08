import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatRadioChange, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FuseConfigService } from '@fuse/services/config.service';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { GatePassInfo, GatePassNoData, GatePassModel } from './../../../models/gateEntry.model';
import { ValidateReference } from 'app/Validators/ValidateReference';
import { GateEntryService } from 'app/services/gate-entry.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
@Component({
    selector: 'app-gate-entry',
    templateUrl: './gate-entry.component.html',
    styleUrls: ['./gate-entry.component.scss']
})
export class GateEntryComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    BGClassName: any;
    notificationSnackBarComponent: NotificationSnackBarComponent;

    showOrderType = false;
    referenceOptions: string[] = [];
    referenceInwardOptions: string[] = ['Select process', 'Receipt - with PO', 'Receipt - without PO', 'Receipt - with contractor items'];
    referenceOutwardOptions: string[] = [
        'Select process',
        'Dispatch - FG',
        'Dispatch - KEG',
        'Dispatch - Others',
        'Dispatch - Company Returnable',
        'Dispatch - Contractor Items'
    ];
    gateEntryForm: FormGroup;
    poItemTableColumns: string[] = ['item', 'po', 'material', 'description', 'qty', 'uom'];
    // POItemRowDataSource = new MatTableDataSource<GatePassInfo>(ELEMENT_DATA);
    POItemRowDataSource = new BehaviorSubject<AbstractControl[]>([]);
    selection = new SelectionModel<GatePassInfo>(true, []);
    allGatePassNoData: GatePassNoData[];
    selectedGTNo: string;
    poItemRows: FormArray = this._formBuilder.array([]);

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _gateEntryService: GateEntryService,
        public snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.initForm();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

    ngOnInit(): void {
        this.getAllGateEntries();
        this.referenceOptions = this.referenceInwardOptions;
        this.subscription.add(
            this._fuseConfigService.config.subscribe(config => {
                this.BGClassName = config;
            })
        );
    }

    initForm(): void {
        this.gateEntryForm = this._formBuilder.group({
            RegisterType: ['Inward'],
            OrderType: [null],
            ReferenceType: ['Select process', [Validators.required, ValidateReference]],
            Plant: [{ value: '3201', disabled: true }],
            Vendor: ['', Validators.required],
            TransportMode: ['Truck', Validators.required],
            ChallanNo: ['', Validators.required],
            Driver: [''],
            ChallanDate: ['', Validators.required],
            DrivingLicense: [''],
            GateIn: [{ value: 'Gate 1', disabled: true }],
            VehiceNo: [''],
            GateInDate: [{ value: new Date(), disabled: true }],
            GateExit: [{ value: 'Gate 1', disabled: true }],
            GateInUser: [{ value: '3201_gate', disabled: true }],
            GateExitDate: [{ value: new Date(), disabled: true }],
            ReportingDate: [{ value: new Date(), disabled: true }],
            GateExitUser: [{ value: '3201_gate', disabled: true }],
            ReferenceNo: [{ value: null, disabled: true }],
            TareWeight: [''],
            GrossWeight: [''],
            NetWeight: [''],
            Remarks: [''],
            GatePassItem: this.poItemRows
        });
    }

    ClearForm(): void {
        this.gateEntryForm.get('RegisterType').enable();
        this.gateEntryForm.get('ReferenceType').enable();
        this.gateEntryForm.get('TransportMode').enable();
        this.gateEntryForm.get('ChallanDate').enable();
        this.selectedGTNo = null;
        this.clearFormArray();
        this.initForm();
    }

    clearFormArray(): void {
        while (this.poItemRows.length !== 0) {
            this.poItemRows.removeAt(0);
        }
        this.POItemRowDataSource.next(this.poItemRows.controls);
    }

    registerTypeChanged($event: MatRadioChange): void {
        if ($event.value === 'Inward') {
            this.referenceOptions = this.referenceInwardOptions;
        } else {
            this.referenceOptions = this.referenceOutwardOptions;
        }
    }

    ChangeReference(value: string): void {
        this.showOrderType = value === 'Receipt - with PO' ? true : false;
    }

    orderTypeChanged($event: MatRadioChange): void {}

    getAllGateEntries(): void {
        this._gateEntryService.GetAllGatePassNoData().subscribe(
            (data: GatePassNoData[]) => {
                if (data.length > 0) {
                    this.allGatePassNoData = data;
                    // this.GTNOSelected(this.allGatePassNoData[0]);
                }
            },
            error => {
                this.notificationSnackBarComponent.openSnackBar(error instanceof Object ? 'Something went wrong' : error, SnackBarStatus.danger);
            }
        );
    }

    GTNoSelected(gatePassData: GatePassNoData): void {
        this.selectedGTNo = gatePassData.GT_No;
        this._gateEntryService.GetThisGatePassData(gatePassData.GT_No).subscribe(
            (returnedData: GatePassModel) => {
                this.UpdateGateEntryForm(returnedData);
            },
            error => {
                this.notificationSnackBarComponent.openSnackBar(error instanceof Object ? 'Something went wrong' : error, SnackBarStatus.danger);
            }
        );
    }

    UpdateGateEntryForm(data: GatePassModel): void {
        this.gateEntryForm.get('RegisterType').patchValue(data.RegisterType);
        this.gateEntryForm.get('ReferenceType').patchValue(data.ReferenceType);
        this.gateEntryForm.get('Plant').patchValue(data.Plant);
        this.gateEntryForm.get('Vendor').patchValue(data.Vendor);
        this.gateEntryForm.get('TransportMode').patchValue(data.TransportMode);
        this.gateEntryForm.get('ChallanNo').patchValue(data.ChallanNo);
        this.gateEntryForm.get('Driver').patchValue(data.Driver);
        this.gateEntryForm.get('ChallanDate').patchValue(data.ChallanDate);
        this.gateEntryForm.get('DrivingLicense').patchValue(data.DrivingLicense);
        this.gateEntryForm.get('GateIn').patchValue(data.GateIn);
        this.gateEntryForm.get('VehiceNo').patchValue(data.VehiceNo);
        this.gateEntryForm.get('GateInDate').patchValue(data.GateInDate);
        // this.gateEntryForm.get('GateExit').patchValue(data.GateExit);
        this.gateEntryForm.get('GateInUser').patchValue(data.GateInUser);
        // this.gateEntryForm.get('GateExitDate').patchValue(data.GateExitDate);
        this.gateEntryForm.get('ReportingDate').patchValue(data.ReportingDate);
        // this.gateEntryForm.get('GateExitUser').patchValue(data.GateExitUser);
        this.gateEntryForm.get('ReferenceNo').patchValue(data.GT_NO);
        this.gateEntryForm.get('TareWeight').patchValue(data.TareWeight);
        this.gateEntryForm.get('GrossWeight').patchValue(data.GrossWeight);
        this.gateEntryForm.get('NetWeight').patchValue(data.NetWeight);
        this.gateEntryForm.get('Remarks').patchValue(data.Remarks);
        this.UpdateItemTableRow(data.GatePassItem);
        this.gateEntryForm.disable();
        // this.POItemRowDataSource = new MatTableDataSource<GatePassInfo>(data.GatePassItem);
    }

    AddItemTableRow(): void {
        const row = this._formBuilder.group({
            Item: ['', Validators.required],
            PO: ['', Validators.required],
            Material: ['', Validators.required],
            Description: ['', Validators.required],
            Qty: ['', Validators.required],
            UoM: ['', Validators.required]
        });
        this.poItemRows.push(row);
        this.POItemRowDataSource.next(this.poItemRows.controls);
    }

    DeleteLastTableRow(): void {
        this.poItemRows.removeAt(this.poItemRows.length - 1);
        this.POItemRowDataSource.next(this.poItemRows.controls);
    }

    UpdateItemTableRow(tableData: GatePassInfo[]): void {
        this.clearFormArray();
        tableData.forEach(rowData => {
            const row = this._formBuilder.group({
                Item: [rowData.Item, Validators.required],
                PO: [rowData.PO, Validators.required],
                Material: [rowData.Material, Validators.required],
                Description: [rowData.Description, Validators.required],
                Qty: [rowData.Qty, Validators.required],
                UoM: [rowData.UoM, Validators.required]
            });
            this.poItemRows.push(row);
        });
        this.POItemRowDataSource.next(this.poItemRows.controls);
    }

    Validate(): void {
        if (!this.selectedGTNo) {
            this.Confirmation('Create', 'Create Gate entry');
        } else {
            this.Confirmation('Update', 'Gate entry');
        }
        // if (this.gateEntryForm.valid) {
        //     if (!this.selectedGTNo) {
        //         this.Confirmation('Create', 'Create Gate entry');
        //     } else {
        //         this.Confirmation('Update', 'Update Gate entry');
        //     }
        // } else {
        //     this.notificationSnackBarComponent.openSnackBar('Validation failed', SnackBarStatus.danger);
        // }
    }

    Confirmation(actionType: string, category: string): void {
        const dialogConfig: MatDialogConfig = {
            data: {
                Actiontype: actionType,
                Catagory: category
            }
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        this.subscription.add(
            dialogRef.afterClosed().subscribe(result => {
                console.log('observer');
                if (result) {
                    this.onSubmit();
                }
            })
        );
    }

    onSubmit(): void {
        this._gateEntryService.savePOGateEntry(this.gateEntryForm.getRawValue()).subscribe(
            data => {
                this.notificationSnackBarComponent.openSnackBar('Gate entry created successfully', SnackBarStatus.success);
                this.ClearForm();
                this.getAllGateEntries();
            },
            err => {
                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
