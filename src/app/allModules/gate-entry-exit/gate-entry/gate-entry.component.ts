import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatRadioChange, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { GatePassInfo, GatePassNoData, GatePassModel } from './../../../models/gateEntry.model';
import { ValidateReference } from 'app/Validators/ValidateReference';
import { GateEntryService } from 'app/services/gate-entry.service';

const ELEMENT_DATA: GatePassInfo[] = [{ PO: 'Hydrogen', Item: 10, Material: 'Cold drinks', Description: '1.0079', Qty: 12, UoM: 'KG' }];
@Component({
    selector: 'app-gate-entry',
    templateUrl: './gate-entry.component.html',
    styleUrls: ['./gate-entry.component.scss']
})
export class GateEntryComponent implements OnInit {
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
    displayedColumns: string[] = ['select', 'item', 'po', 'material', 'description', 'qty', 'uom'];
    dataSource = new MatTableDataSource<GatePassInfo>(ELEMENT_DATA);
    selection = new SelectionModel<GatePassInfo>(true, []);
    allGatePassNoData: GatePassNoData[];
    selectGTNO: string;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private form: FormBuilder,
        private _gateEntryService: GateEntryService,
        public snackBar: MatSnackBar
    ) {
        this.initForm();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

    ngOnInit(): void {
        this.getAllGateEntries();
        this.referenceOptions = this.referenceInwardOptions;
        this._fuseConfigService.config.subscribe(config => {
            this.BGClassName = config;
        });
    }

    initForm(): void {
        this.gateEntryForm = this.form.group({
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
            GatePassItem: ['']
        });
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle(): void {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    checkboxLabel(row?: GatePassInfo): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.PO + 1}`;
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

    onSubmit(): void {
        this.gateEntryForm.patchValue({ GatePassItem: this.selection.selected });
        this._gateEntryService.savePOGateEntry(this.gateEntryForm.getRawValue()).subscribe(
            data => {
                this.notificationSnackBarComponent.openSnackBar('Gate entry created successfully', SnackBarStatus.success);
                this.getAllGateEntries();
            },
            err => {
                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            }
        );
    }

    getAllGateEntries(): void {
        this._gateEntryService.GetAllGatePassNoData().subscribe(
            (data: GatePassNoData[]) => {
                if (data.length > 0) {
                    this.allGatePassNoData = data;
                    this.GTNOSelected(this.allGatePassNoData[0]);
                }
            },
            error => {
                this.notificationSnackBarComponent.openSnackBar(error instanceof Object ? 'Something went wrong' : error, SnackBarStatus.danger);
            }
        );
    }

    GTNOSelected(gatePassData: GatePassNoData): void {
        this.selectGTNO = gatePassData.GT_No;
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
        this.gateEntryForm.get('GateExit').patchValue(data.GateExit);
        this.gateEntryForm.get('GateInUser').patchValue(data.GateInUser);
        this.gateEntryForm.get('GateExitDate').patchValue(data.GateExitDate);
        this.gateEntryForm.get('ReportingDate').patchValue(data.ReportingDate);
        this.gateEntryForm.get('GateExitUser').patchValue(data.GateExitUser);
        this.gateEntryForm.get('ReferenceNo').patchValue(data.GT_NO);
        this.gateEntryForm.get('TareWeight').patchValue(data.TareWeight);
        this.gateEntryForm.get('GrossWeight').patchValue(data.GrossWeight);
        this.gateEntryForm.get('NetWeight').patchValue(data.NetWeight);
        this.gateEntryForm.get('Remarks').patchValue(data.Remarks);
    }
}
