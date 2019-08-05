import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialogConfig, MatDialog, MatSnackBar, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { VendorLocation, ASN, ASNHeaderView, ASNItem, ASNPackageDetail, Auxiliary, POView } from 'app/models/asn';
import { ASNService } from 'app/services/asn.service';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { FileUploader } from 'ng2-file-upload';
import { BehaviorSubject } from 'rxjs';
import { isNumber } from 'util';
import { isNumeric } from 'rxjs/util/isNumeric';
import { ActivatedRoute } from '@angular/router';


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
    AllAcknowledgedPOViews: POView[] = [];
    // SelectedTransID: number;
    SelectedPO: string;
    SelectedPOItem: string;
    fileToUpload: File;
    fileToUploadList: File[] = [];
    AttachmentDetailsList: AttachmentDetails[] = [];
    fileUploader: FileUploader;
    PO_ID: string;
    ASNItemColumns: string[] = [
        'Select',
        'Item',
        'OrderedQuantity',
        'UOM',
        'ApprovedQuantity',
        'InProcessQuantity',
        'OfferedQuantity',
        'PackageID',
        'BatchNumber',
        'Remarks',
        'MaterialDescription',
    ];
    ASNPackageDetailsColumns: string[] = ['no', 'PackageID', 'PackageType', 'ReferenceNumber',
        'Dimension', 'GrossWeight', 'Volume', 'NetWeight', 'VolumeUOM', 'GrossWeightUOM'];
    displayedColumns2: string[] = ['InvoiceNo', 'InvoiceDate', 'InvoiceAmount', 'Currency', 'Delete'];
    displayedColumns3: string[] = ['AttachmentNumber', 'AttachmentName', 'DocumentType', 'Delete'];
    ASNItemDataSource: MatTableDataSource<ASNItem>;
    ASNPackageDetailsDataSource = new BehaviorSubject<AbstractControl[]>([]);
    rows: FormArray = this._formBuilder.array([]);
    dataSourse2: MatTableDataSource<VendorInvoice>;
    AttachmentDataSource: MatTableDataSource<AttachmentDetails>;
    selection: SelectionModel<ASNItem>;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('AttachmentTable') AttachmentTable: MatTable<any>;
    ASNFormGroup: FormGroup;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _asnService: ASNService,
        public snackBar: MatSnackBar,
        private dialog: MatDialog,
        private route: ActivatedRoute
    ) {
        this.ASNClass = new ASN();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.route.queryParams.subscribe(params => {
            this.SelectedPO = params['id'];
            this.SelectedPOItem = params['item'];
        });
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
            // ShipFrom: ['', Validators.required],
            Vendor: ['', Validators.required],
            Name1: ['', Validators.required],
            Name2: ['', Validators.required],
            Street: ['', Validators.required],
            City: ['', Validators.required],
            PINCode: ['', Validators.required],
            Region: ['', Validators.required],
            Country: ['', Validators.required],
            ASNItems: this._formBuilder.array([
                this.addASNItemFormGroup()
            ]),
            ASNPackageDetails: this.rows
            // CreatedBy: ['', Validators.required]
        });
        // this.dataSourse1 = new MatTableDataSource();
        this.dataSourse2 = new MatTableDataSource(ELEMENT_DATA2);
        // this.AttachmentDataSource = new MatTableDataSource(ELEMENT_DATA3);
        // this.ASNItemDataSource.sort = this.sort;
        // this.dataSourse1.sort = this.sort;
        this.dataSourse2.sort = this.sort;
        // this.AttachmentDataSource.sort = this.sort;
        this.selection = new SelectionModel(true, []);
        this.getAllVendorLocations();
        // this.GetAllASNHeaderViews();
        this.GetAllAcknowledgedPOViews();
        // this.isAllSelected();
        // this.masterToggle();
        // this.checkboxLabel();
        // console.log(this.dataSourse1);
        this._fuseConfigService.config
            // .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.BGClassName = config;
            });
    }
    addASNItemFormGroup(): FormGroup {
        return this._formBuilder.group({
            // Item: ['', Validators.required],
            // OrderedQuantity: ['', Validators.required],
            // MaterialDescription: ['', Validators.required],
            // UnitOfMeasure: ['', Validators.required],
            // Plant: ['', Validators.required],
            // Vendor: ['', Validators.required],
            // Currency: ['', Validators.required],
            // Details: ['', Validators.required],
            PackageID: ['', Validators.required],
            BatchNumber: ['', Validators.required],
            Remarks: ['', Validators.required],
            Number: ['', Validators.required],
            ItemDate: ['', Validators.required],
            DepatureDate: ['', Validators.required],
            ExpDateOfArrival: ['', Validators.required],
            ChallanNumber: ['', Validators.required],
            ChallanDate: ['', Validators.required],
            TransporterName: ['', Validators.required],
        });
    }
    addASNPackageDetailsFormGroup(): void {
        const row = this._formBuilder.group({
            // Item: ['', Validators.required],
            PackageID: ['', Validators.required],
            PackageType: ['', Validators.required],
            ReferenceNumber: ['', Validators.required],
            Dimension: ['', Validators.required],
            GrossWeight: ['', Validators.required],
            Volume: ['', Validators.required],
            NetWeight: ['', Validators.required],
            VolumeUOM: ['', Validators.required],
            GrossWeightUOM: ['', Validators.required],
        });
        this.rows.push(row);
        this.ASNPackageDetailsDataSource.next(this.rows.controls);
        // return row;
    }

    ResetControl(): void {
        this.ASNClass = new ASN();
        this.ASNItemDataSource = new MatTableDataSource([]);
        this.ASNFormGroup.reset();
        Object.keys(this.ASNFormGroup.controls).forEach(key => {
            this.ASNFormGroup.get(key).markAsUntouched();
        });
        this.ResetASNPackageDetails();
        this.ResetAttachements();
    }
    ResetSelectedPO(): void {
        this.SelectedPO = '';
        this.SelectedPOItem = '';
    }
    ClearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }
    ResetASNPackageDetails(): void {
        this.ClearFormArray(this.rows);
        // this.rows = this._formBuilder.array([]);
        // this.addASNPackageDetailsFormGroup();
        this.ASNPackageDetailsDataSource.next(this.rows.controls);
    }
    ResetAttachements(): void {
        this.AttachmentDetailsList = [];
        this.AttachmentDataSource = new MatTableDataSource(this.AttachmentDetailsList);
        this.fileToUploadList = [];
    }
    // NoOfPackagesChanged(value: any): void {
    //     if (isNumeric(value)) {
    //         const val = +value;
    //     } else {

    //     }
    // }
    AddPackages(): void {
        const NoOfPac = +this.ASNFormGroup.get('NoOfPackages').value;
        const r = this.rows.length;
        if (NoOfPac - r < 0) {
            // if (this.ASNClass.TransID) {
            //     const NoofRowsToDelete = r - NoOfPac;
            //     for (let i = r - 1; i >= r - NoofRowsToDelete; i--) {
            //         this.rows.removeAt(i);
            //         this.ASNPackageDetailsDataSource.next(this.rows.controls);
            //     }
            // } else {
            //     this.rows = this._formBuilder.array([]);
            //     this.ASNPackageDetailsDataSource.next(this.rows.controls);
            //     r = this.rows.length;
            // }
            const NoofRowsToDelete = r - NoOfPac;
            for (let i = r - 1; i >= r - NoofRowsToDelete; i--) {
                this.rows.removeAt(i);
                this.ASNPackageDetailsDataSource.next(this.rows.controls);
            }
        }
        else if (NoOfPac - r === 0) {
            this.notificationSnackBarComponent.openSnackBar('no more packages to add', SnackBarStatus.warning);
        }
        else {
            // for (let i = 0; i < NoOfPac - r; i++) {
            //     this.addASNPackageDetailsFormGroup();
            // }
            this.addASNPackageDetailsFormGroup();
        }

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
    // isAllSelected(): boolean {
    //     const numSelected = this.selection.selected.length;
    //     const numRows = this.ASNItemDataSource.data.length;
    //     return numSelected === numRows;
    // }
    // masterToggle(): void {
    //     this.isAllSelected() ? this.selection.clear() : this.ASNItemDataSource.data.forEach(row => this.selection.select(row));
    // }
    // /** The label for the checkbox on the passed row */
    // checkboxLabel(row?: ASNItem): string {
    //     if (!row) {
    //         return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    //     }
    //     return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Item + 1}`;
    // }



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

    GetAllAcknowledgedPOViews(): void {
        const AcknowledgementStatus = 'closed';
        this._asnService.GetAllPOByAcknowledgementStatus(AcknowledgementStatus).subscribe(
            (data) => {
                this.AllAcknowledgedPOViews = data as POView[];
                if (this.SelectedPO && this.SelectedPOItem) {
                    const s = this.AllAcknowledgedPOViews.filter(x => x.PO === this.SelectedPO && x.Item === this.SelectedPOItem)[0];
                    this.headerClick(s);
                }
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
                this.ASNFormGroup.get('Name1').patchValue(selectedVendorLocation.Name1);
                this.ASNFormGroup.get('Name2').patchValue(selectedVendorLocation.Name2);
                this.ASNFormGroup.get('Street').patchValue(selectedVendorLocation.Street);
                this.ASNFormGroup.get('City').patchValue(selectedVendorLocation.City);
                this.ASNFormGroup.get('PINCode').patchValue(selectedVendorLocation.PINCode);
                this.ASNFormGroup.get('Region').patchValue(selectedVendorLocation.Region);
                this.ASNFormGroup.get('Country').patchValue(selectedVendorLocation.Country);
            }

        } else {
            // this.ASNFormGroup.get('Vendor').patchValue('');
            this.ASNFormGroup.get('Name1').patchValue('');
            this.ASNFormGroup.get('Name2').patchValue('');
            this.ASNFormGroup.get('Street').patchValue('');
            this.ASNFormGroup.get('City').patchValue('');
            this.ASNFormGroup.get('PINCode').patchValue('');
            this.ASNFormGroup.get('Region').patchValue('');
            this.ASNFormGroup.get('Country').patchValue('');
        }
    }

    GetASNHeaderValues(): void {
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
        // this.ASNClass.ShipFrom = this.ASNFormGroup.get('ShipFrom').value;
        this.ASNClass.Vendor = this.ASNFormGroup.get('Vendor').value;
        this.ASNClass.Name1 = this.ASNFormGroup.get('Name1').value;
        this.ASNClass.Name2 = this.ASNFormGroup.get('Name2').value;
        this.ASNClass.Street = this.ASNFormGroup.get('Street').value;
        this.ASNClass.City = this.ASNFormGroup.get('City').value;
        this.ASNClass.PINCode = this.ASNFormGroup.get('PINCode').value;
        this.ASNClass.Region = this.ASNFormGroup.get('Region').value;
        this.ASNClass.Country = this.ASNFormGroup.get('Country').value;
        this.ASNClass.Remarks = this.ASNFormGroup.get('Remarks').value;
    }
    GetASNItemDetailValues(): void {
        // this.ASNClass.ASNItems = [];
        const ASNItemsFormArray = this.ASNFormGroup.get('ASNItems') as FormArray;
        ASNItemsFormArray.controls.forEach((x, i) => {
            // const ASNIte = new ASNItem();
            this.ASNClass.ASNItems[i].PackageID = x.get('PackageID').value;
            this.ASNClass.ASNItems[i].BatchNumber = x.get('BatchNumber').value;
            this.ASNClass.ASNItems[i].Remarks = x.get('Remarks').value;
            this.ASNClass.ASNItems[i].Number = x.get('Number').value;
            this.ASNClass.ASNItems[i].ItemDate = x.get('ItemDate').value;
            this.ASNClass.ASNItems[i].DepatureDate = x.get('DepatureDate').value;
            this.ASNClass.ASNItems[i].ExpDateOfArrival = x.get('ExpDateOfArrival').value;
            this.ASNClass.ASNItems[i].ChallanNumber = x.get('ChallanNumber').value;
            this.ASNClass.ASNItems[i].ChallanDate = x.get('ChallanDate').value;
            this.ASNClass.ASNItems[i].TransporterName = x.get('TransporterName').value;
            // this.ASNClass.ASNItems.push(ASNIte);
        });

    }

    GetASNPackageDetails(): void {
        this.ASNClass.ASNPackageDetails = [];
        const ASNPackageDetailsFormArray = this.ASNFormGroup.get('ASNPackageDetails') as FormArray;
        ASNPackageDetailsFormArray.controls.forEach((x, i) => {
            if (i < this.ASNClass.NoOfPackages) {
                const asn: ASNPackageDetail = new ASNPackageDetail();
                asn.PackageID = x.get('PackageID').value;
                asn.PackageType = x.get('PackageType').value;
                asn.ReferenceNumber = x.get('ReferenceNumber').value;
                asn.Dimension = x.get('Dimension').value;
                asn.GrossWeight = x.get('GrossWeight').value;
                asn.Volume = x.get('Volume').value;
                asn.NetWeight = x.get('NetWeight').value;
                asn.VolumeUOM = x.get('VolumeUOM').value;
                asn.GrossWeightUOM = x.get('GrossWeightUOM').value;
                this.ASNClass.ASNPackageDetails.push(asn);
            }
        });
    }

    submitASNDetails(val: string): void {

        if (this.ASNFormGroup.valid) {
            if (this.ASNClass.TransID) {
                const dialogConfig: MatDialogConfig = {
                    data: {
                        Actiontype: 'Update',
                        Catagory: 'ASN Details'
                    },
                };
                const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
                dialogRef.afterClosed().subscribe(
                    result => {
                        if (result) {
                            this.ASNClass.Status = val;
                            this.GetASNHeaderValues();
                            this.GetASNItemDetailValues();
                            this.GetASNPackageDetails();
                            this._asnService.UpdateASN(this.ASNClass).subscribe(
                                (data) => {
                                    const TransID = data as number;
                                    const aux = new Auxiliary();
                                    aux.APPID = 1;
                                    aux.APPNumber = TransID;
                                    this._asnService.AddASNAttachment(aux, this.fileToUploadList).subscribe(
                                        (dat) => {
                                            this.ResetControl();
                                            this.ResetSelectedPO();
                                            this.notificationSnackBarComponent.openSnackBar('ASN details updated successfully', SnackBarStatus.success);
                                            // this.GetAllASNHeaderViews();
                                            this.GetAllAcknowledgedPOViews();
                                        },
                                        (err) => {
                                            console.error(err);
                                            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                                        }
                                    );
                                },
                                (err) => {
                                    console.error(err);
                                    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                                }
                            );
                        }
                    }
                );
            } else {
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
                            this.ASNClass.Status = val;
                            this.GetASNHeaderValues();
                            this.GetASNItemDetailValues();
                            this.GetASNPackageDetails();
                            this._asnService.CreateASN(this.ASNClass).subscribe(
                                (data) => {
                                    const TransID = data as number;
                                    const aux = new Auxiliary();
                                    aux.APPID = 1;
                                    aux.APPNumber = TransID;
                                    this._asnService.AddASNAttachment(aux, this.fileToUploadList).subscribe(
                                        (dat) => {
                                            this.ResetControl();
                                            this.ResetSelectedPO();
                                            this.notificationSnackBarComponent.openSnackBar('ASN details created successfully', SnackBarStatus.success);
                                            // this.GetAllASNHeaderViews();
                                            this.GetAllAcknowledgedPOViews();
                                        },
                                        (err) => {
                                            console.error(err);
                                            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                                        }
                                    );
                                },
                                (err) => {
                                    console.error(err);
                                    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                                }
                            );
                        }
                    });
            }
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
    headerClick(SelectPOView: POView): void {
        this.SelectedPO = SelectPOView.PO;
        this.SelectedPOItem = SelectPOView.Item;
        if (SelectPOView.ASNStatus.toLowerCase() === 'open') {
            this.ResetControl();
            this.ASNClass.ASN_Header_PO = this.SelectedPO;
            this.ASNFormGroup.get('ASN_Header_PO').patchValue(this.ASNClass.ASN_Header_PO);
            this.ASNClass.ASNItems = [];
            const ASNIte = new ASNItem();
            ASNIte.Item = this.SelectedPOItem;
            ASNIte.MaterialDescription = SelectPOView.MaterialDescription;
            ASNIte.OrderedQuantity = SelectPOView.OrderedQuantity;
            ASNIte.UOM = SelectPOView.UnitOfMeasure;
            this.ASNClass.ASNItems.push(ASNIte);
            this.ASNItemDataSource = new MatTableDataSource(this.ASNClass.ASNItems);

        } else {
            this.GetASNByPO(this.SelectedPO, this.SelectedPOItem);
        }
    }
    InsertASNHeaderValues(): void {
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
        // this.ASNFormGroup.get('ShipFrom').patchValue(this.ASNClass.ShipFrom);
        this.ASNFormGroup.get('Vendor').patchValue(this.ASNClass.Vendor);
        this.ASNFormGroup.get('Name1').patchValue(this.ASNClass.Name1);
        this.ASNFormGroup.get('Name2').patchValue(this.ASNClass.Name2);
        this.ASNFormGroup.get('Street').patchValue(this.ASNClass.Street);
        this.ASNFormGroup.get('City').patchValue(this.ASNClass.City);
        this.ASNFormGroup.get('PINCode').patchValue(this.ASNClass.PINCode);
        this.ASNFormGroup.get('Region').patchValue(this.ASNClass.Region);
        this.ASNFormGroup.get('Country').patchValue(this.ASNClass.Country);
        this.ASNFormGroup.get('Remarks').patchValue(this.ASNClass.Remarks);

    }
    InsertASNItemsFormGroup(): void {
        const ASNItemsFormArray = this.ASNFormGroup.get('ASNItems') as FormArray;
        ASNItemsFormArray.controls.forEach((x, i) => {
            x.get('PackageID').patchValue(this.ASNClass.ASNItems[i].PackageID);
            x.get('BatchNumber').patchValue(this.ASNClass.ASNItems[i].BatchNumber);
            x.get('Remarks').patchValue(this.ASNClass.ASNItems[i].Remarks);
            x.get('Number').patchValue(this.ASNClass.ASNItems[i].Number);
            x.get('ItemDate').patchValue(this.ASNClass.ASNItems[i].ItemDate);
            x.get('DepatureDate').patchValue(this.ASNClass.ASNItems[i].DepatureDate);
            x.get('ExpDateOfArrival').patchValue(this.ASNClass.ASNItems[i].ExpDateOfArrival);
            x.get('ChallanNumber').patchValue(this.ASNClass.ASNItems[i].ChallanNumber);
            x.get('ChallanDate').patchValue(this.ASNClass.ASNItems[i].ChallanDate);
            x.get('TransporterName').patchValue(this.ASNClass.ASNItems[i].TransporterName);
        });
    }
    InsertASNPackageDetailsFormGroup(packDetails: ASNPackageDetail): void {
        const row = this._formBuilder.group({
            PackageID: [packDetails.PackageID, Validators.required],
            PackageType: [packDetails.PackageType, Validators.required],
            ReferenceNumber: [packDetails.ReferenceNumber, Validators.required],
            Dimension: [packDetails.Dimension, Validators.required],
            GrossWeight: [packDetails.GrossWeight, Validators.required],
            Volume: [packDetails.VolumeUOM, Validators.required],
            NetWeight: [packDetails.NetWeight, Validators.required],
            VolumeUOM: [packDetails.VolumeUOM, Validators.required],
            GrossWeightUOM: [packDetails.GrossWeightUOM, Validators.required],
        });
        this.rows.push(row);
        this.ASNPackageDetailsDataSource.next(this.rows.controls);
        // return row;
    }
    GetASNByTransID(TransID): void {
        this._asnService.GetASNByTransID(TransID).subscribe(
            (data) => {
                if (data) {
                    this.ASNClass = data as ASN;
                    this.InsertASNHeaderValues();
                    if (this.ASNClass.ASNItems && this.ASNClass.ASNItems.length) {
                        this.ASNItemDataSource = new MatTableDataSource(this.ASNClass.ASNItems);
                        this.InsertASNItemsFormGroup();
                    }
                    if (this.ASNClass.ASNPackageDetails && this.ASNClass.ASNPackageDetails.length) {
                        this.ClearFormArray(this.rows);
                        this.ASNClass.ASNPackageDetails.forEach((x, i) => {
                            if (i < this.ASNClass.NoOfPackages) {
                                this.InsertASNPackageDetailsFormGroup(x);
                            }
                        });
                    } else {
                        this.ResetASNPackageDetails();
                    }

                }

            },
            (err) => {
                console.log(err);
            }
        );
    }

    GetASNByPO(PO: string, Item: string): void {
        this._asnService.GetASNByPO(PO, Item).subscribe(
            (data) => {
                if (data) {
                    this.ASNClass = data as ASN;
                    this.GetAttachmentViewsByAppID(1, this.ASNClass.TransID);
                    this.InsertASNHeaderValues();
                    if (this.ASNClass.ASNItems && this.ASNClass.ASNItems.length) {
                        this.ASNItemDataSource = new MatTableDataSource(this.ASNClass.ASNItems);
                        this.InsertASNItemsFormGroup();
                    }
                    if (this.ASNClass.ASNPackageDetails && this.ASNClass.ASNPackageDetails.length) {
                        this.ClearFormArray(this.rows);
                        this.ASNClass.ASNPackageDetails.forEach((x, i) => {
                            if (i < this.ASNClass.NoOfPackages) {
                                this.InsertASNPackageDetailsFormGroup(x);
                            }
                        });
                    } else {
                        this.ResetASNPackageDetails();
                    }

                }

            },
            (err) => {
                console.log(err);
            }
        );
    }
    GetAttachmentViewsByAppID(APPID: number, APPNumber: number): void {
        this._asnService.GetAttachmentViewsByAppID(APPID, APPNumber).subscribe(
            (data) => {
                this.AttachmentDetailsList = data as AttachmentDetails[];
                this.AttachmentDataSource = new MatTableDataSource(this.AttachmentDetailsList);
                if (this.AttachmentDetailsList && this.AttachmentDetailsList.length) {
                    this.AttachmentDetailsList.forEach(f => {
                        this.fileToUpload = new File([''], f.AttachmentName, { type: f.DocumentType });
                        this.fileToUploadList.push(this.fileToUpload);
                    });
                }

            },
            (err) => {
                console.error(err);
            }
        );
    }

    handleFileInput(evt): void {
        if (evt.target.files && evt.target.files.length > 0) {
            this.fileToUpload = evt.target.files[0];
            this.fileToUploadList.push(this.fileToUpload);
            this.AttachmentDetailsList.push({
                AttachmentName: this.fileToUpload.name,
                AttachmentNumber: 0,
                DocumentType: this.fileToUpload.type
            });
            this.AttachmentDataSource = new MatTableDataSource(this.AttachmentDetailsList);
        }
    }
    DeleteAttachment(row: AttachmentDetails): void {
        const indexx = this.fileToUploadList.findIndex(x => x.name === row.AttachmentName);
        this.fileToUploadList.splice(indexx, 1);
        const index = this.AttachmentDetailsList.indexOf(row);
        this.AttachmentDetailsList.splice(index, 1);
        this.AttachmentDataSource = new MatTableDataSource(this.AttachmentDetailsList);
        this.AttachmentTable.renderRows();
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
