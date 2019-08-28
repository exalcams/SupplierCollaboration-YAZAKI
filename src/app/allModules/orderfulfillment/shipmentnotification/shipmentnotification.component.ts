import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialogConfig, MatDialog, MatSnackBar, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { VendorLocation, ASN, ASNHeaderView, ASNItem, ASNPackageDetail, Auxiliary, POView, AcknowledgementView } from 'app/models/asn';
import { ASNService } from 'app/services/asn.service';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { FileUploader } from 'ng2-file-upload';
import { BehaviorSubject } from 'rxjs';
import { isNumber } from 'util';
import { isNumeric } from 'rxjs/util/isNumeric';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationDetails, App } from 'app/models/master';
import { MasterService } from 'app/services/master.service';
import { Location } from '@angular/common';
import { ExcelService } from 'app/services/excel.service';
import { Acknowledgement } from 'app/models/dashboard';


@Component({
    selector: 'app-shipmentnotification',
    templateUrl: './shipmentnotification.component.html',
    styleUrls: ['./shipmentnotification.component.scss']
    // encapsulation: ViewEncapsulation.None,
    // animations: fuseAnimations
})
export class ShipmentnotificationComponent implements OnInit {
    authenticationDetails: AuthenticationDetails;
    CurrentUserName: string;
    BGClassName: any;
    AcknowledgementStatus = 'closed';
    ASNClass: ASN;
    ASNAppID: number;
    VendorLocationList: VendorLocation[];
    notificationSnackBarComponent: NotificationSnackBarComponent;
    IsProgressBarVisibile: boolean;
    AllASNHeaderViews: ASNHeaderView[] = [];
    AllAcknowledgedPOViews: POView[] = [];
    // SelectedTransID: number;
    SelectedPO: string;
    SelectedPOItem: string;
    SelectedASNStatus: string;
    fileToUpload: File;
    fileToUploadList: File[] = [];
    AttachmentDetailsList: AttachmentDetails[] = [];
    fileUploader: FileUploader;
    PO_ID: string;
    isDisable = true;
    ASNItemColumns: string[] = [
        'Item',
        'ScheduleLine',
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
    ASNItemsDataSource = new BehaviorSubject<AbstractControl[]>([]);
    ASNItemsFormArray: FormArray = this._formBuilder.array([]);
    ASNPackageDetailsDataSource = new BehaviorSubject<AbstractControl[]>([]);
    ASNPackageDetailsFormArray: FormArray = this._formBuilder.array([]);
    dataSourse2: MatTableDataSource<VendorInvoice>;
    AttachmentDataSource: MatTableDataSource<AttachmentDetails>;
    selection: SelectionModel<ASNItem>;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('AttachmentTable') AttachmentTable: MatTable<any>;
    @ViewChild('ASNItemTable') ASNItemTable: ElementRef;
    ASNFormGroup: FormGroup;
    ZeroIndex = 0;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _asnService: ASNService,
        private _masterService: MasterService,
        private _excelService: ExcelService,
        private _router: Router,
        private _location: Location,
        public snackBar: MatSnackBar,
        private dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        this.ASNClass = new ASN();
        this.ASNAppID = 0;
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.IsProgressBarVisibile = false;
        this.route.queryParams.subscribe(params => {
            this.SelectedPO = params['id'];
            this.SelectedPOItem = params['item'];
            this.SelectedASNStatus = params['status'];
        });
        this._location.replaceState(this._router.url.split('?')[0]);
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
            ASNItems: this.ASNItemsFormArray,
            Number: ['', Validators.required],
            ItemDate: ['', Validators.required],
            DepatureDate: ['', Validators.required],
            ExpDateOfArrival: ['', Validators.required],
            ChallanNumber: ['', Validators.required],
            ChallanDate: ['', Validators.required],
            TransporterName: ['', Validators.required],
            ASNPackageDetails: this.ASNPackageDetailsFormArray
            // CreatedBy: ['', Validators.required]
        });
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.CurrentUserName = this.authenticationDetails.userName;
        } else {
            this._router.navigate(['/auth/login']);
        }
        // this.dataSourse1 = new MatTableDataSource();
        this.dataSourse2 = new MatTableDataSource(ELEMENT_DATA2);
        // this.AttachmentDataSource = new MatTableDataSource(ELEMENT_DATA3);
        // this.ASNItemsDataSource.sort = this.sort;
        // this.dataSourse1.sort = this.sort;
        this.dataSourse2.sort = this.sort;
        // this.AttachmentDataSource.sort = this.sort;
        this.selection = new SelectionModel(true, []);
        this.GetAppByName();
        this.getAllVendorLocations();
        // this.GetAllASNHeaderViews();
        // this.GetAllAcknowledgedPOViews();
        this.GetAllPOByAckAndASNStatus();
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
    addASNItemFormGroup(): void {
        const row = this._formBuilder.group({
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
        this.ASNItemsFormArray.push(row);
        this.ASNItemsDataSource.next(this.ASNItemsFormArray.controls);
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
        this.ASNPackageDetailsFormArray.push(row);
        this.ASNPackageDetailsDataSource.next(this.ASNPackageDetailsFormArray.controls);
        // return row;
    }

    ResetControl(): void {
        this.ASNClass = new ASN();
        this.ASNFormGroup.reset();
        Object.keys(this.ASNFormGroup.controls).forEach(key => {
            this.ASNFormGroup.get(key).markAsUntouched();
        });
        this.ResetASNItems();
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
    ResetASNItems(): void {
        this.ClearFormArray(this.ASNItemsFormArray);
        // this.ASNPackageDetailsFormArray = this._formBuilder.array([]);
        // this.addASNPackageDetailsFormGroup();
        this.ASNItemsDataSource.next(this.ASNItemsFormArray.controls);
    }
    ResetASNPackageDetails(): void {
        this.ClearFormArray(this.ASNPackageDetailsFormArray);
        // this.ASNPackageDetailsFormArray = this._formBuilder.array([]);
        // this.addASNPackageDetailsFormGroup();
        this.ASNPackageDetailsDataSource.next(this.ASNPackageDetailsFormArray.controls);
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
        if (this.SelectedASNStatus !== 'ASNCompleted') {
            const NoOfPac = +this.ASNFormGroup.get('NoOfPackages').value;
            const r = this.ASNPackageDetailsFormArray.length;
            if (NoOfPac - r < 0) {
                // if (this.ASNClass.TransID) {
                //     const NoofRowsToDelete = r - NoOfPac;
                //     for (let i = r - 1; i >= r - NoofRowsToDelete; i--) {
                //         this.ASNPackageDetailsFormArray.removeAt(i);
                //         this.ASNPackageDetailsDataSource.next(this.ASNPackageDetailsFormArray.controls);
                //     }
                // } else {
                //     this.ASNPackageDetailsFormArray = this._formBuilder.array([]);
                //     this.ASNPackageDetailsDataSource.next(this.ASNPackageDetailsFormArray.controls);
                //     r = this.ASNPackageDetailsFormArray.length;
                // }
                const NoofRowsToDelete = r - NoOfPac;
                for (let i = r - 1; i >= r - NoofRowsToDelete; i--) {
                    this.ASNPackageDetailsFormArray.removeAt(i);
                    this.ASNPackageDetailsDataSource.next(this.ASNPackageDetailsFormArray.controls);
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

    }
    RemovePackages(): void {
        if (this.SelectedASNStatus !== 'ASNCompleted') {
            if (this.ASNPackageDetailsFormArray.length > 0) {
                this.ASNPackageDetailsFormArray.removeAt(this.ASNPackageDetailsFormArray.length - 1);
                this.ASNPackageDetailsDataSource.next(this.ASNPackageDetailsFormArray.controls);
            } else {
                this.notificationSnackBarComponent.openSnackBar('no packages to delete', SnackBarStatus.warning);
            }
        }
    }
    GetAppByName(): void {
        const AppName = 'ASN';
        this._masterService.GetAppByName(AppName).subscribe(
            (data) => {
                const ASNAPP = data as App;
                if (ASNAPP) {
                    this.ASNAppID = ASNAPP.AppID;
                }
            },
            (err) => {
                console.error(err);
            }
        );
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
    //     const numRows = this.ASNItemsDataSource.data.length;
    //     return numSelected === numRows;
    // }
    // masterToggle(): void {
    //     this.isAllSelected() ? this.selection.clear() : this.ASNItemsDataSource.data.forEach(row => this.selection.select(row));
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
        // const AcknowledgementStatus = 'closed';
        this._asnService.GetAllPOByAcknowledgementStatus(this.AcknowledgementStatus).subscribe(
            (data) => {
                this.AllAcknowledgedPOViews = data as POView[];
                if (this.SelectedPO && this.SelectedPOItem) {
                    const s = this.AllAcknowledgedPOViews.filter(x => x.PO === this.SelectedPO && x.Item === this.SelectedPOItem)[0];
                    if (s) {
                        this.headerClick(s);
                        // this.SelectedPO = '';
                        // this.SelectedPOItem = '';

                    }
                }
            },
            (err) => {
                console.error(err);
            }
        );
    }
    ASNStatusSelected(ASNStatusValue: string): void {
        this.ResetControl();
        this.ResetSelectedPO();
        this.GetAllPOByAckAndASNStatus();
        this.getAllVendorLocations();
    }

    GetAllPOByAckAndASNStatus(): void {
        this._asnService.GetAllPOByAckAndASNStatus(this.AcknowledgementStatus, this.SelectedASNStatus).subscribe(
            (data) => {
                this.AllAcknowledgedPOViews = data as POView[];
                if (this.SelectedPO && this.SelectedPOItem) {
                    const s = this.AllAcknowledgedPOViews.filter(x => x.PO === this.SelectedPO && x.Item === this.SelectedPOItem)[0];
                    if (s) {
                        this.headerClick(s);
                        // this.SelectedPO = '';
                        // this.SelectedPOItem = '';
                    }
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

        this.ASNClass.ASNItems = [];
        const ASNItemsFormArr = this.ASNFormGroup.get('ASNItems') as FormArray;
        ASNItemsFormArr.controls.forEach((x, i) => {
            const item: ASNItem = new ASNItem();
            item.Item = x.get('Item').value;
            item.ScheduleLine = x.get('ScheduleLine').value;
            item.OrderedQuantity = x.get('OrderedQuantity').value;
            item.UOM = x.get('UOM').value;
            item.ApprovedQuantity = x.get('ApprovedQuantity').value;
            item.InProcessQuantity = x.get('InProcessQuantity').value;
            item.OfferedQuantity = x.get('OfferedQuantity').value;
            item.PackageID = x.get('PackageID').value;
            item.BatchNumber = x.get('BatchNumber').value;
            item.Remarks = x.get('Remarks').value;
            item.MaterialDescription = x.get('MaterialDescription').value;
            item.Number = this.ASNFormGroup.get('Number').value;
            item.ItemDate = this.ASNFormGroup.get('ItemDate').value;
            item.DepatureDate = this.ASNFormGroup.get('DepatureDate').value;
            item.ExpDateOfArrival = this.ASNFormGroup.get('ExpDateOfArrival').value;
            item.ChallanNumber = this.ASNFormGroup.get('ChallanNumber').value;
            item.ChallanDate = this.ASNFormGroup.get('ChallanDate').value;
            item.TransporterName = this.ASNFormGroup.get('TransporterName').value;
            item.ApprovedQuantity = item.ApprovedQuantity ? item.ApprovedQuantity : 0;
            item.InProcessQuantity = item.InProcessQuantity ? item.InProcessQuantity : 0;
            item.OfferedQuantity = item.OfferedQuantity ? item.OfferedQuantity : 0;
            this.ASNClass.ASNItems.push(item);
        });

        // // this.ASNClass.ASNItems = [];
        // const ASNItemsFormArray = this.ASNFormGroup.get('ASNItems') as FormArray;
        // ASNItemsFormArray.controls.forEach((x, i) => {
        //     // const ASNIte = new ASNItem();
        //     this.ASNClass.ASNItems[i].PackageID = x.get('PackageID').value;
        //     this.ASNClass.ASNItems[i].BatchNumber = x.get('BatchNumber').value;
        //     this.ASNClass.ASNItems[i].Remarks = x.get('Remarks').value;
        //     this.ASNClass.ASNItems[i].Number = x.get('Number').value;
        //     this.ASNClass.ASNItems[i].ItemDate = x.get('ItemDate').value;
        //     this.ASNClass.ASNItems[i].DepatureDate = x.get('DepatureDate').value;
        //     this.ASNClass.ASNItems[i].ExpDateOfArrival = x.get('ExpDateOfArrival').value;
        //     this.ASNClass.ASNItems[i].ChallanNumber = x.get('ChallanNumber').value;
        //     this.ASNClass.ASNItems[i].ChallanDate = x.get('ChallanDate').value;
        //     this.ASNClass.ASNItems[i].TransporterName = x.get('TransporterName').value;
        //     // this.ASNClass.ASNItems.push(ASNIte);
        // });

    }

    GetASNPackageDetails(): void {
        this.ASNClass.ASNPackageDetails = [];
        const ASNPackageDetailsFormArr = this.ASNFormGroup.get('ASNPackageDetails') as FormArray;
        ASNPackageDetailsFormArr.controls.forEach((x, i) => {
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
        this.ASNFormGroup.enable();
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
                            this.IsProgressBarVisibile = true;
                            this.ASNClass.Status = val;
                            this.GetASNHeaderValues();
                            this.GetASNItemDetailValues();
                            this.GetASNPackageDetails();
                            this.ASNClass.ModifiedBy = this.CurrentUserName;
                            this._asnService.UpdateASN(this.ASNClass).subscribe(
                                (data) => {
                                    const TransID = data as number;
                                    const aux = new Auxiliary();
                                    aux.APPID = this.ASNAppID;
                                    aux.APPNumber = TransID;
                                    aux.CreatedBy = this.CurrentUserName;
                                    this._asnService.AddASNAttachment(aux, this.fileToUploadList).subscribe(
                                        (dat) => {
                                            this.IsProgressBarVisibile = false;
                                            this.ResetControl();
                                            this.ResetSelectedPO();
                                            this.notificationSnackBarComponent.openSnackBar('ASN details updated successfully', SnackBarStatus.success);
                                            // this.GetAllASNHeaderViews();
                                            // this.GetAllAcknowledgedPOViews();
                                            this.GetAllPOByAckAndASNStatus();
                                            this.getAllVendorLocations();
                                        },
                                        (err) => {
                                            console.error(err);
                                            this.IsProgressBarVisibile = false;
                                            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                                        }
                                    );
                                },
                                (err) => {
                                    console.error(err);
                                    this.IsProgressBarVisibile = false;
                                    this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                                }
                            );
                        } else {
                            if (this.SelectedASNStatus === 'ASNCompleted') {
                                // this.ASNFormGroup.disable();
                                Object.keys(this.ASNFormGroup.controls).forEach(key2 => {
                                    this.ASNFormGroup.get(key2).disable();
                                });
                            }
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
                            this.IsProgressBarVisibile = true;
                            this.ASNClass.Status = val;
                            this.GetASNHeaderValues();
                            this.GetASNItemDetailValues();
                            this.GetASNPackageDetails();
                            this.ASNClass.CreatedBy = this.CurrentUserName;
                            this._asnService.CreateASN(this.ASNClass).subscribe(
                                (data) => {
                                    const TransID = data as number;
                                    const aux = new Auxiliary();
                                    aux.APPID = this.ASNAppID;
                                    aux.APPNumber = TransID;
                                    aux.CreatedBy = this.CurrentUserName;
                                    this._asnService.AddASNAttachment(aux, this.fileToUploadList).subscribe(
                                        (dat) => {
                                            this.IsProgressBarVisibile = false;
                                            this.ResetControl();
                                            this.ResetSelectedPO();
                                            this.notificationSnackBarComponent.openSnackBar('ASN details created successfully', SnackBarStatus.success);
                                            // this.GetAllASNHeaderViews();
                                            // this.GetAllAcknowledgedPOViews();
                                            this.GetAllPOByAckAndASNStatus();
                                            this.getAllVendorLocations();
                                        },
                                        (err) => {
                                            console.error(err);
                                            this.IsProgressBarVisibile = false;
                                            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                                        }
                                    );
                                },
                                (err) => {
                                    console.error(err);
                                    this.IsProgressBarVisibile = false;
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
                if (this.ASNFormGroup.get(key) instanceof FormArray) {
                    const FormArrayControls = this.ASNFormGroup.get(key) as FormArray;
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
    headerClick(SelectPOView: POView): void {
        this.SelectedPO = SelectPOView.PO;
        this.SelectedPOItem = SelectPOView.Item;
        if (SelectPOView.ASNStatus.toLowerCase() === 'open') {
            this.ResetControl();
            this.ASNClass.ASN_Header_PO = this.SelectedPO;
            this.ASNFormGroup.enable();
            this.ASNFormGroup.get('ASN_Header_PO').disable();
            this.ASNFormGroup.get('ASN_Header_PO').patchValue(this.ASNClass.ASN_Header_PO);
            this.ASNClass.ASNItems = [];
            this.ClearFormArray(this.ASNItemsFormArray);
            this.GetAcknowledgementsByPOAndItem(this.SelectedPO, this.SelectedPOItem);
            // const ASNIte = new ASNItem();
            // ASNIte.Item = this.SelectedPOItem;
            // ASNIte.MaterialDescription = SelectPOView.MaterialDescription;
            // ASNIte.OrderedQuantity = SelectPOView.OrderedQuantity;
            // ASNIte.UOM = SelectPOView.UnitOfMeasure;
            // this.ASNClass.ASNItems.push(ASNIte);
            // // this.ASNItemsDataSource = new MatTableDataSource(this.ASNClass.ASNItems);
            // this.ClearFormArray(this.ASNItemsFormArray);
            // this.ASNClass.ASNItems.forEach(x => {
            //     this.InsertASNItemsFormGroup(x);
            // });

        } else {
            this.GetASNByPO(this.SelectedPO, this.SelectedPOItem);
        }
    }
    InsertASNHeaderValues(): void {
        this.ASNFormGroup.patchValue({
            ASN_Header_PO: this.ASNClass.ASN_Header_PO,
            NoOfPackages: this.ASNClass.NoOfPackages,
            NotificationDate: this.ASNClass.NotificationDate,
            GrossWeight: this.ASNClass.GrossWeight,
            GrossWeightUOM: this.ASNClass.GrossWeightUOM,
            DispatchLocation: this.ASNClass.DispatchLocation,
            NetWeight: this.ASNClass.NetWeight,
            GargoType: this.ASNClass.GargoType,
            Volume: this.ASNClass.Volume,
            VolumeUOM: this.ASNClass.VolumeUOM,
            ModeOfTransport: this.ASNClass.ModeOfTransport,
            GeneralMaterialDescription: this.ASNClass.MaterialDescription,
            Vendor: this.ASNClass.Vendor,
            Name1: this.ASNClass.Name1,
            Name2: this.ASNClass.Name2,
            Street: this.ASNClass.Street,
            City: this.ASNClass.City,
            PINCode: this.ASNClass.PINCode,
            Region: this.ASNClass.Region,
            Country: this.ASNClass.Country,
            Remarks: this.ASNClass.Remarks,
        });
        // this.ASNFormGroup.disable();
        // this.ASNFormGroup.get('ASN_Header_PO').disable();
        // this.ASNFormGroup.get('ASN_Header_PO').patchValue(this.ASNClass.ASN_Header_PO);
        // this.ASNFormGroup.get('NoOfPackages').patchValue(this.ASNClass.NoOfPackages);
        // this.ASNFormGroup.get('NotificationDate').patchValue(this.ASNClass.NotificationDate);
        // this.ASNFormGroup.get('GrossWeight').patchValue(this.ASNClass.GrossWeight);
        // this.ASNFormGroup.get('GrossWeightUOM').patchValue(this.ASNClass.GrossWeightUOM);
        // this.ASNFormGroup.get('DispatchLocation').patchValue(this.ASNClass.DispatchLocation);
        // this.ASNFormGroup.get('NetWeight').patchValue(this.ASNClass.NetWeight);
        // this.ASNFormGroup.get('GargoType').patchValue(this.ASNClass.GargoType);
        // this.ASNFormGroup.get('Volume').patchValue(this.ASNClass.Volume);
        // this.ASNFormGroup.get('VolumeUOM').patchValue(this.ASNClass.VolumeUOM);
        // this.ASNFormGroup.get('ModeOfTransport').patchValue(this.ASNClass.ModeOfTransport);
        // this.ASNFormGroup.get('GeneralMaterialDescription').patchValue(this.ASNClass.MaterialDescription);
        // this.ASNFormGroup.get('Vendor').patchValue(this.ASNClass.Vendor);
        // this.ASNFormGroup.get('Name1').patchValue(this.ASNClass.Name1);
        // this.ASNFormGroup.get('Name2').patchValue(this.ASNClass.Name2);
        // this.ASNFormGroup.get('Street').patchValue(this.ASNClass.Street);
        // this.ASNFormGroup.get('City').patchValue(this.ASNClass.City);
        // this.ASNFormGroup.get('PINCode').patchValue(this.ASNClass.PINCode);
        // this.ASNFormGroup.get('Region').patchValue(this.ASNClass.Region);
        // this.ASNFormGroup.get('Country').patchValue(this.ASNClass.Country);
        // this.ASNFormGroup.get('Remarks').patchValue(this.ASNClass.Remarks);

    }
    InsertASNItemsFormGroup(item: ASNItem): void {
        const row = this._formBuilder.group({
            Item: [item.Item],
            ScheduleLine: [item.ScheduleLine],
            OrderedQuantity: [item.OrderedQuantity],
            UOM: [item.UOM],
            ApprovedQuantity: [item.ApprovedQuantity],
            InProcessQuantity: [item.InProcessQuantity],
            OfferedQuantity: [item.OfferedQuantity],
            PackageID: [item.PackageID, Validators.required],
            BatchNumber: [item.BatchNumber, Validators.required],
            Remarks: [item.Remarks, Validators.required],
            MaterialDescription: [item.MaterialDescription],
        });
        row.disable();
        row.get('PackageID').enable();
        row.get('BatchNumber').enable();
        row.get('Remarks').enable();
        this.ASNItemsFormArray.push(row);
        this.ASNItemsDataSource.next(this.ASNItemsFormArray.controls);
        this.ASNFormGroup.patchValue({
            Number: item.Number,
            ItemDate: item.ItemDate,
            DepatureDate: item.DepatureDate,
            ExpDateOfArrival: item.ExpDateOfArrival,
            ChallanDate: item.ChallanDate,
            ChallanNumber: item.ChallanNumber,
            TransporterName: item.TransporterName
        });


        // const ASNItemsFormArray = this.ASNFormGroup.get('ASNItems') as FormArray;
        // // ASNItemsFormArray.enable();
        // ASNItemsFormArray.controls.forEach((x, i) => {
        //     x.patchValue({
        //         PackageID: this.ASNClass.ASNItems[i].PackageID,
        //         BatchNumber: this.ASNClass.ASNItems[i].BatchNumber,
        //         Remarks: this.ASNClass.ASNItems[i].Remarks,
        //         Number: this.ASNClass.ASNItems[i].Number,
        //         ItemDate: this.ASNClass.ASNItems[i].ItemDate,
        //         DepatureDate: this.ASNClass.ASNItems[i].DepatureDate,
        //         ExpDateOfArrival: this.ASNClass.ASNItems[i].ExpDateOfArrival,
        //         ChallanNumber: this.ASNClass.ASNItems[i].ChallanNumber,
        //         ChallanDate: this.ASNClass.ASNItems[i].ChallanDate,
        //         TransporterName: this.ASNClass.ASNItems[i].TransporterName,
        //     });
        //     // x.get('PackageID').patchValue(this.ASNClass.ASNItems[i].PackageID);
        //     // x.get('BatchNumber').patchValue(this.ASNClass.ASNItems[i].BatchNumber);
        //     // x.get('Remarks').patchValue(this.ASNClass.ASNItems[i].Remarks);
        //     // x.get('Number').patchValue(this.ASNClass.ASNItems[i].Number);
        //     // x.get('ItemDate').patchValue(this.ASNClass.ASNItems[i].ItemDate);
        //     // x.get('DepatureDate').patchValue(this.ASNClass.ASNItems[i].DepatureDate);
        //     // x.get('ExpDateOfArrival').patchValue(this.ASNClass.ASNItems[i].ExpDateOfArrival);
        //     // x.get('ChallanNumber').patchValue(this.ASNClass.ASNItems[i].ChallanNumber);
        //     // x.get('ChallanDate').patchValue(this.ASNClass.ASNItems[i].ChallanDate);
        //     // x.get('TransporterName').patchValue(this.ASNClass.ASNItems[i].TransporterName);
        // });
    }
    InsertASNPackageDetailsFormGroup(packDetails: ASNPackageDetail): void {
        const row = this._formBuilder.group({
            PackageID: [packDetails.PackageID, Validators.required],
            PackageType: [packDetails.PackageType, Validators.required],
            ReferenceNumber: [packDetails.ReferenceNumber, Validators.required],
            Dimension: [packDetails.Dimension, Validators.required],
            GrossWeight: [packDetails.GrossWeight, Validators.required],
            Volume: [packDetails.Volume, Validators.required],
            NetWeight: [packDetails.NetWeight, Validators.required],
            VolumeUOM: [packDetails.VolumeUOM, Validators.required],
            GrossWeightUOM: [packDetails.GrossWeightUOM, Validators.required],
        });
        this.ASNPackageDetailsFormArray.push(row);
        this.ASNPackageDetailsDataSource.next(this.ASNPackageDetailsFormArray.controls);
        // return row;
    }
    GetASNByTransID(TransID): void {
        this._asnService.GetASNByTransID(TransID).subscribe(
            (data) => {
                if (data) {
                    this.ASNClass = data as ASN;
                    if (this.SelectedASNStatus === 'ASNCompleted') {
                        this.ASNFormGroup.disable();
                    }
                    this.InsertASNHeaderValues();
                    if (this.ASNClass.ASNItems && this.ASNClass.ASNItems.length) {
                        this.ClearFormArray(this.ASNItemsFormArray);
                        this.ASNClass.ASNItems.forEach(x => {
                            this.InsertASNItemsFormGroup(x);
                        });
                    } else {
                        this.ResetASNItems();
                    }
                    if (this.ASNClass.ASNPackageDetails && this.ASNClass.ASNPackageDetails.length) {
                        this.ClearFormArray(this.ASNPackageDetailsFormArray);
                        this.ASNClass.ASNPackageDetails.forEach((x, i) => {
                            if (i < this.ASNClass.NoOfPackages) {
                                this.InsertASNPackageDetailsFormGroup(x);
                                // this.ASNPackageDetailsFormArray.enable();
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

    GetAcknowledgementsByPOAndItem(PO: string, Item: string): void {
        this._asnService.GetAcknowledgementsByPOAndItem(PO, Item).subscribe(
            (data) => {
                if (data) {
                    const AllAcknowledgements = data as AcknowledgementView[];
                    AllAcknowledgements.forEach(x => {
                        const ASNIte = new ASNItem();
                        ASNIte.Item = this.SelectedPOItem;
                        ASNIte.ScheduleLine = x.ScheduleLine;
                        ASNIte.MaterialDescription = x.MaterialDescription;
                        ASNIte.OrderedQuantity = x.OrderedQuantity;
                        ASNIte.ApprovedQuantity = x.ApprovedQuantity;
                        ASNIte.UOM = x.UOM;
                        this.ASNClass.ASNItems.push(ASNIte);
                        this.InsertASNItemsFormGroup(ASNIte);
                    });
                }
            },
            (err) => {
                console.error(err);
            }
        );
    }

    GetASNByPO(PO: string, Item: string): void {
        this._asnService.GetASNByPO(PO, Item).subscribe(
            (data) => {
                if (data) {
                    this.ASNClass = data as ASN;

                    this.GetAttachmentViewsByAppID(this.ASNAppID, this.ASNClass.TransID);
                    this.InsertASNHeaderValues();
                    if (this.ASNClass.ASNItems && this.ASNClass.ASNItems.length) {
                        this.ClearFormArray(this.ASNItemsFormArray);
                        this.ASNClass.ASNItems.forEach(x => {
                            this.InsertASNItemsFormGroup(x);
                        });
                    } else {
                        this.ResetASNItems();
                    }
                    if (this.ASNClass.ASNPackageDetails && this.ASNClass.ASNPackageDetails.length) {
                        this.ClearFormArray(this.ASNPackageDetailsFormArray);
                        this.ASNClass.ASNPackageDetails.forEach((x, i) => {
                            if (i < this.ASNClass.NoOfPackages) {
                                this.InsertASNPackageDetailsFormGroup(x);
                            }
                        });
                    } else {
                        this.ResetASNPackageDetails();
                    }
                    if (this.SelectedASNStatus === 'ASNCompleted') {
                        // this.ASNFormGroup.disable();
                        Object.keys(this.ASNFormGroup.controls).forEach(key2 => {
                            this.ASNFormGroup.get(key2).disable();
                        });
                    } else {
                        this.ASNFormGroup.enable();
                        this.DisableASNItemsInputs();
                        this.ASNFormGroup.get('ASN_Header_PO').disable();
                    }
                }

            },
            (err) => {
                console.log(err);
            }
        );
    }
    DisableASNItemsInputs(): void {
        const ASNItemsFormArr = this.ASNFormGroup.get('ASNItems') as FormArray;
        ASNItemsFormArr.controls.forEach((row, i) => {
            row.disable();
            row.get('PackageID').enable();
            row.get('BatchNumber').enable();
            row.get('Remarks').enable();
        });
    }
    GetAttachmentViewsByAppID(APPID: number, APPNumber: number): void {
        this.ResetAttachements();
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

    exportAsXLSX(): void {
        // const currentPageIndex = this.TransDetailsDataSource.paginator.pageIndex;
        // const PageSize = this.TransDetailsDataSource.paginator.pageSize;
        // const startIndex = currentPageIndex * PageSize;
        // const endIndex = startIndex + PageSize;
        // const itemsShowed = this.TransDetailsList.slice(startIndex, endIndex);
        const itemsShowed1: any[] = [];
        this.ASNClass.ASNItems.forEach(x => {
            const dt = {
                'Item': x.Item, 'Ordered Quantity': x.OrderedQuantity, 'UOM': x.UOM,
                'Approved Quantity': x.ApprovedQuantity, 'In progress Quantity': x.InProcessQuantity,
                'Offered Quantity': x.OfferedQuantity, 'Package ID': x.PackageID, 'Batch Number': x.BatchNumber,
                'Remarks': x.Remarks, 'Material Description': x.MaterialDescription
            };
            itemsShowed1.push(dt);
        });
        this._excelService.exportAsExcelFile(itemsShowed1, 'ASN Item');
        // const itemsShowed1 = this.ASNItemTable.nativeElement;
        // this._excelService.exportTableToExcel(itemsShowed1, 'ASN Item');
    }
    BackToDashboard(): void {
        this._router.navigate(['/dashboard']);
        // { queryParams: { id: this.POId } }
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
