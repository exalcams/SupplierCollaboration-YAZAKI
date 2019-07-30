import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { VendorLocation, ASN, ASNHeaderView, ASNItem } from 'app/models/asn';
import { ASNService } from 'app/services/asn.service';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
    selector: 'app-shipmentnotification',
    templateUrl: './shipmentnotification.component.html',
    styleUrls: ['./shipmentnotification.component.scss']
    // encapsulation: ViewEncapsulation.None,
    // animations: fuseAnimations
})
export class ShipmentnotificationComponent implements OnInit {
    BGClassName: any;
    ASNClass: ASN;
    VendorLocationList: VendorLocation[];
    notificationSnackBarComponent: NotificationSnackBarComponent;
    AllASNHeaderViews: ASNHeaderView[] = [];
    SelectedTransID: number;
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
    @ViewChild(MatSort) sort: MatSort;
    ASNFormGroup: FormGroup;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _asnService: ASNService,
        public snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.ASNClass = new ASN();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

    ngOnInit(): void {
        this.ASNFormGroup = this._formBuilder.group({
            ASN_Header_PO: ['', Validators.required],
            // Status: ['', Validators.required],
            NoOfPackages: ['', Validators.required],
            NotificationDate: ['', Validators.required],
            GrossWeight: ['', Validators.required],
            GrossWeightUOM: ['', Validators.required],
            NetWeight: ['', Validators.required],
            DispatchLocation: ['', Validators.required],
            Volume: ['', Validators.required],
            VolumeUOM: ['', Validators.required],
            ModeOfTransport: ['', Validators.required],
            GargoType: ['', Validators.required],
            // GargoDescription: ['', Validators.required],
            GeneralMaterialDescription: ['', Validators.required],
            Remarks: ['', Validators.required],
            ShipFrom: ['', Validators.required],
            Vendor: ['', Validators.required],
            Item: ['', Validators.required],
            Name: ['', Validators.required],
            Street: ['', Validators.required],
            City: ['', Validators.required],
            PINCode: ['', Validators.required],
            Region: ['', Validators.required],
            Country: ['', Validators.required],
            ASNItems: this._formBuilder.array([
                this.addASNItemFormGroup()
            ]),
            // ASNPackageDetails: this._formBuilder.array([
            //     this.addASNPackageDetailsFormGroup()
            // ]),
            // CreatedBy: ['', Validators.required]
        });
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.dataSourse1 = new MatTableDataSource();
        this.dataSourse2 = new MatTableDataSource(ELEMENT_DATA2);
        this.dataSourse3 = new MatTableDataSource(ELEMENT_DATA3);
        this.dataSource.sort = this.sort;
        this.dataSourse1.sort = this.sort;
        this.dataSourse2.sort = this.sort;
        this.dataSourse3.sort = this.sort;
        this.selection = new SelectionModel(true, []);
        this.getAllVendorLocations();
        this.GetAllASNHeaderViews();
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
    addASNItemFormGroup(): FormGroup {
        return this._formBuilder.group({
            // Item: ['', Validators.required],
            // MaterialDescription: ['', Validators.required],
            // OrderedQuantity: ['', Validators.required],
            // UnitOfMeasure: ['', Validators.required],
            // BatchNumber: ['', Validators.required],
            // Plant: ['', Validators.required],
            // Vendor: ['', Validators.required],
            // Currency: ['', Validators.required],
            // Details: ['', Validators.required],
            Number: ['', Validators.required],
            ItemDate: ['', Validators.required],
            DepatureDate: ['', Validators.required],
            ExpDateOfArrival: ['', Validators.required],
            ChallanNumber: ['', Validators.required],
            ChallanDate: ['', Validators.required],
            TransporterName: ['', Validators.required],
        });
    }
    addASNPackageDetailsFormGroup(): FormGroup {
        return this._formBuilder.group({
            Item: ['', Validators.required],
            PackageID: ['', Validators.required],
            PackageType: ['', Validators.required],
            ReferenceNumber: ['', Validators.required],
            Dimension: ['', Validators.required],
            GrossWeight: ['', Validators.required],
            Volume: ['', Validators.required],
            VolumeUnitOfMeasure: ['', Validators.required],
        });
    }
    getAllVendorLocations(): void {
        this._asnService.GetAllVendorLocations().subscribe(
            (data) => {
                this.VendorLocationList = data as VendorLocation[];
            },
            (err) => {
                console.log(err);
            }
        );
    }

    // click(){
    //   alert("hi");
    // }
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

    ResetControl(): void {
        this.ASNClass = new ASN();
        this.ASNFormGroup.reset();
        Object.keys(this.ASNFormGroup.controls).forEach(key => {
            this.ASNFormGroup.get(key).markAsUntouched();
        });

    }

    GetAllASNHeaderViews(): void {
        this._asnService.GetAllASNHeaderViews().subscribe(
            (data) => {
                this.AllASNHeaderViews = data as ASNHeaderView[];
            },
            (err) => {
                console.error(err);
            }
        );
    }

    shipFromSelected(val: string): void {
        // console.log(val);
        if (val && val !== 'others') {
            const selectedVendorLocation = this.VendorLocationList.filter(x => x.Vendor === val)[0];
            if (selectedVendorLocation) {
                this.ASNFormGroup.get('Vendor').patchValue(selectedVendorLocation.Vendor);
                this.ASNFormGroup.get('Item').patchValue(selectedVendorLocation.Item);
                this.ASNFormGroup.get('Name').patchValue(selectedVendorLocation.Name);
                this.ASNFormGroup.get('Street').patchValue(selectedVendorLocation.Street);
                this.ASNFormGroup.get('City').patchValue(selectedVendorLocation.City);
                this.ASNFormGroup.get('PINCode').patchValue(selectedVendorLocation.PINCode);
                this.ASNFormGroup.get('Region').patchValue(selectedVendorLocation.Region);
                this.ASNFormGroup.get('Country').patchValue(selectedVendorLocation.Country);
            }

        } else {
            this.ASNFormGroup.get('Vendor').patchValue('');
            this.ASNFormGroup.get('Item').patchValue('');
            this.ASNFormGroup.get('Name').patchValue('');
            this.ASNFormGroup.get('Street').patchValue('');
            this.ASNFormGroup.get('City').patchValue('');
            this.ASNFormGroup.get('PINCode').patchValue('');
            this.ASNFormGroup.get('Region').patchValue('');
            this.ASNFormGroup.get('Country').patchValue('');
        }
    }

    submitASNDetails(): void {

        if (this.ASNFormGroup.valid) {
            // if (this.ASNClass.TransID) {

            // } else {
            const dialogConfig: MatDialogConfig = {
                data: {
                    Actiontype: 'Create',
                    Catagory: 'ASN Details'
                },
            };
            const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(
                result => {
                    if (result) {
                        this.ASNClass.Status = 'Open';
                        this.ASNClass.ASN_Header_PO = this.ASNFormGroup.get('ASN_Header_PO').value;
                        this.ASNClass.NoOfPackages = this.ASNFormGroup.get('NoOfPackages').value;
                        this.ASNClass.NotificationDate = this.ASNFormGroup.get('NotificationDate').value;
                        this.ASNClass.GrossWeight = this.ASNFormGroup.get('GrossWeight').value;
                        this.ASNClass.GrossWeightUOM = this.ASNFormGroup.get('GrossWeightUOM').value;
                        this.ASNClass.DispatchLocation = this.ASNFormGroup.get('DispatchLocation').value;
                        this.ASNClass.NetWeight = this.ASNFormGroup.get('NetWeight').value;
                        this.ASNClass.GargoType = this.ASNFormGroup.get('GargoType').value;
                        this.ASNClass.Volume = this.ASNFormGroup.get('Volume').value;
                        this.ASNClass.VolumeUOM = this.ASNFormGroup.get('VolumeUOM').value;
                        this.ASNClass.ModeOfTransport = this.ASNFormGroup.get('ModeOfTransport').value;
                        this.ASNClass.MaterialDescription = this.ASNFormGroup.get('GeneralMaterialDescription').value;
                        this.ASNClass.ShipFrom = this.ASNFormGroup.get('ShipFrom').value;
                        this.ASNClass.Vendor = this.ASNFormGroup.get('Vendor').value;
                        this.ASNClass.Item = this.ASNFormGroup.get('Item').value;
                        this.ASNClass.Name = this.ASNFormGroup.get('Name').value;
                        this.ASNClass.Street = this.ASNFormGroup.get('Street').value;
                        this.ASNClass.City = this.ASNFormGroup.get('City').value;
                        this.ASNClass.PINCode = this.ASNFormGroup.get('PINCode').value;
                        this.ASNClass.Region = this.ASNFormGroup.get('Region').value;
                        this.ASNClass.Country = this.ASNFormGroup.get('Country').value;
                        this.ASNClass.ASNItems = [];
                        const ASNItemsFormArray = this.ASNFormGroup.get('ASNItems') as FormArray;
                        ASNItemsFormArray.controls.forEach(x => {
                            const ASNIte = new ASNItem();
                            ASNIte.Item = '10';
                            ASNIte.Number = x.get('Number').value;
                            ASNIte.ItemDate = x.get('ItemDate').value;
                            ASNIte.DepatureDate = x.get('DepatureDate').value;
                            ASNIte.ExpDateOfArrival = x.get('ExpDateOfArrival').value;
                            ASNIte.ChallanNumber = x.get('ChallanNumber').value;
                            ASNIte.ChallanDate = x.get('ChallanDate').value;
                            ASNIte.TransporterName = x.get('TransporterName').value;
                            this.ASNClass.ASNItems.push(ASNIte);
                        });
                        this._asnService.CreateASN(this.ASNClass).subscribe(
                            (data) => {
                                this.ResetControl();
                                this.notificationSnackBarComponent.openSnackBar('ASN details created successfully', SnackBarStatus.success);
                            },
                            (err) => {
                                console.error(err);
                                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                            }
                        );
                    }
                });
            // }
        } else {
            Object.keys(this.ASNFormGroup.controls).forEach(key => {
                if (!this.ASNFormGroup.get(key).valid) {
                    console.log(key);
                }
                this.ASNFormGroup.get(key).markAsTouched();
                this.ASNFormGroup.get(key).markAsDirty();
            });
        }
    }
    headerClick(TransID: number): void {
        this.SelectedTransID = TransID;
        this.GetASNByTransID(TransID);
    }
    GetASNByTransID(TransID): void {
        this._asnService.GetASNByTransID(TransID).subscribe(
            (data) => {
                if (data) {
                    this.ASNClass = data as ASN;
                    this.ASNFormGroup.get('ASN_Header_PO').patchValue(this.ASNClass.ASN_Header_PO);
                    this.ASNFormGroup.get('NoOfPackages').patchValue(this.ASNClass.NoOfPackages);
                    this.ASNFormGroup.get('NotificationDate').patchValue(this.ASNClass.NotificationDate);
                    this.ASNFormGroup.get('GrossWeight').patchValue(this.ASNClass.GrossWeight);
                    this.ASNFormGroup.get('GrossWeightUOM').patchValue(this.ASNClass.GrossWeightUOM);
                    this.ASNFormGroup.get('DispatchLocation').patchValue(this.ASNClass.DispatchLocation);
                    this.ASNFormGroup.get('NetWeight').patchValue(this.ASNClass.NetWeight);
                    this.ASNFormGroup.get('GargoType').patchValue(this.ASNClass.GargoType);
                    this.ASNFormGroup.get('Volume').patchValue(this.ASNClass.Volume);
                    this.ASNFormGroup.get('VolumeUOM').patchValue(this.ASNClass.VolumeUOM);
                    this.ASNFormGroup.get('ModeOfTransport').patchValue(this.ASNClass.ModeOfTransport);
                    this.ASNFormGroup.get('GeneralMaterialDescription').patchValue(this.ASNClass.MaterialDescription);
                    this.ASNFormGroup.get('ShipFrom').patchValue(this.ASNClass.ShipFrom);
                    this.ASNFormGroup.get('Vendor').patchValue(this.ASNClass.Vendor);
                    this.ASNFormGroup.get('Item').patchValue(this.ASNClass.Item);
                    this.ASNFormGroup.get('Name').patchValue(this.ASNClass.Name);
                    this.ASNFormGroup.get('Street').patchValue(this.ASNClass.Street);
                    this.ASNFormGroup.get('City').patchValue(this.ASNClass.City);
                    this.ASNFormGroup.get('PINCode').patchValue(this.ASNClass.PINCode);
                    this.ASNFormGroup.get('Region').patchValue(this.ASNClass.Region);
                    this.ASNFormGroup.get('Country').patchValue(this.ASNClass.Country);
                    if (this.ASNClass.ASNItems && this.ASNClass.ASNItems.length) {
                        const ASNItemsFormArray = this.ASNFormGroup.get('ASNItems') as FormArray;
                        ASNItemsFormArray.controls.forEach((x, i) => {
                            x.get('Number').patchValue(this.ASNClass.ASNItems[i].Number);
                            x.get('ItemDate').patchValue(this.ASNClass.ASNItems[i].ItemDate);
                            x.get('DepatureDate').patchValue(this.ASNClass.ASNItems[i].DepatureDate);
                            x.get('ExpDateOfArrival').patchValue(this.ASNClass.ASNItems[i].ExpDateOfArrival);
                            x.get('ChallanNumber').patchValue(this.ASNClass.ASNItems[i].ChallanNumber);
                            x.get('ChallanDate').patchValue(this.ASNClass.ASNItems[i].ChallanDate);
                            x.get('TransporterName').patchValue(this.ASNClass.ASNItems[i].TransporterName);
                        });
                    }

                }

            },
            (err) => {
                console.log(err);
            }
        );
    }
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
