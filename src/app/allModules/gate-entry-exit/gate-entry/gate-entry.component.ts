import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';

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
    dataSourse1: MatTableDataSource<PackageDetails>;
    dataSourse2: MatTableDataSource<VendorInvoice>;
    dataSourse3: MatTableDataSource<AttachmentDetails>;
    selection: SelectionModel<Shipment>;

    constructor(private _fuseConfigService: FuseConfigService) { }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.dataSourse1 = new MatTableDataSource();
        this.dataSourse2 = new MatTableDataSource(ELEMENT_DATA2);
        this.dataSourse3 = new MatTableDataSource(ELEMENT_DATA3);
        this.selection = new SelectionModel(true, []);
        this.isAllSelected();
        this.masterToggle();
        this.checkboxLabel();
        console.log(this.dataSourse1);
        this._fuseConfigService.config
            // .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.BGClassName = config;
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
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Shipment): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.no + 1}`;
    }

    DeleteConfiguration(): void { }
}

export interface Shipment {
    vendor: string;
    plant: string;
    poNumber: string;
    currency: string;
    details: string;
    materialDescription: string;
    orderQuantity: number;
    unit: string;
    batch: string;
    no: number;
    select: boolean;
}
export interface PackageDetails {
    packageID: number;
    packageType: string;
    referenceNo: number;
    dimension: string;
    grossWt: string;
    volume: string;
    volumeUnit: string;
    grosss: string;
}
export interface VendorInvoice {
    InvoiceNo: number;
    InvoiceDate: Date;
    InvoiceAmount: string;
    Currency: string;
}
export interface AttachmentDetails {
    AttachmentNumber: number;
    AttachmentName: string;
    DocumentType: string;
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
const ELEMENT_DATA1: PackageDetails[] = [
    { packageID: null, packageType: '', referenceNo: null, dimension: '', grossWt: '', volume: '', volumeUnit: '', grosss: '' }
];
const ELEMENT_DATA2: VendorInvoice[] = [{ InvoiceNo: null, InvoiceDate: null, InvoiceAmount: null, Currency: '' }];
const ELEMENT_DATA3: AttachmentDetails[] = [{ AttachmentNumber: null, AttachmentName: null, DocumentType: null }];
