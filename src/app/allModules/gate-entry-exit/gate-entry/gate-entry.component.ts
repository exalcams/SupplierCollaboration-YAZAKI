import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatTableDataSource, MatRadioChange } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Shipment } from 'app/models/Shipment.model';
import { ValidateReference } from 'app/Validators/ValidateReference';

@Component({
    selector: 'app-gate-entry',
    templateUrl: './gate-entry.component.html',
    styleUrls: ['./gate-entry.component.scss']
})
export class GateEntryComponent implements OnInit {
    BGClassName: any;
    displayedColumns: string[] = [
        'no',
        'materialDescription',
        'orderQuantity',
        'unit',
        'batch',
        'plant',
        'vendor',
        'poNumber',
        'currency',
        'details',
        'select'
    ];
    displayedColumns1: string[] = ['no', 'packageID', 'packageType', 'referenceNo', 'dimension', 'grossWt', 'volume', 'volumeUnit', 'grosss'];
    displayedColumns2: string[] = ['InvoiceNo', 'InvoiceDate', 'InvoiceAmount', 'Currency', 'Delete'];
    displayedColumns3: string[] = ['AttachmentNumber', 'AttachmentName', 'DocumentType', 'Delete'];
    dataSource: MatTableDataSource<Shipment>;
    selection: SelectionModel<Shipment>;

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

    constructor(private _fuseConfigService: FuseConfigService, private form: FormBuilder) {
        this.initForm();
    }

    ngOnInit(): void {
        this.referenceOptions = this.referenceInwardOptions;
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.selection = new SelectionModel(true, []);
        this.isAllSelected();
        this.masterToggle();
        this.checkboxLabel();
        this._fuseConfigService.config.subscribe(config => {
            this.BGClassName = config;
        });
    }

    initForm(): void {
        this.gateEntryForm = this.form.group({
            registerType: ['Inward'],
            orderType: [null],
            referenceType: ['Select process', [Validators.required, ValidateReference]],
            plant: [{ value: '3201', disabled: true }],
            vendor: ['', Validators.required],
            transportType: ['Truck', Validators.required],
            challanRefNo: [''],
            driverName: [''],
            challanRefDate: [''],
            drivingLicense: [''],
            gateIn: [{ value: 'Gate 1', disabled: true }],
            vehicleNo: [''],
            gateInDate: [{ value: new Date(), disabled: true }],
            gateExit: [{ value: 'Gate 1', disabled: true }],
            gateUser: [{ value: '3201_gate', disabled: true }],
            gateExitDate: [{ value: new Date(), disabled: true }],
            reportingTime: [{ value: new Date(), disabled: true }],
            gateExitUser: [{ value: '3201_gate', disabled: true }],
            referenceNo: [''],
            tareWeight: [''],
            grossWeight: [''],
            netWeight: [''],
            remarks: [''],
            poItem: this.form.array([{}])
        });
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

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    masterToggle(): void {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Shipment): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.no + 1}`;
    }

    onSubmit(): void {
        console.log(this.gateEntryForm.getRawValue());
    }
}

const ELEMENT_DATA: Shipment[] = [
    {
        no: 10,
        materialDescription: 'Fastrack-Watches',
        orderQuantity: 2000,
        unit: 'EA',
        batch: '',
        plant: '',
        vendor: '',
        poNumber: '',
        currency: '',
        details: '',
        select: false
    }
];
