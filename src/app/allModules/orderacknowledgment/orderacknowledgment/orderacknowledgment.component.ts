import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatTable, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { PO_OrderAcknowledgement, POOrderScheduleLine, Acknowledgement } from 'app/models/dashboard';
import { FileUploader } from 'ng2-file-upload';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { App, AuthenticationDetails } from 'app/models/master';
import { MasterService } from 'app/services/master.service';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Auxiliary } from 'app/models/asn';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
    selector: 'app-orderacknowledgment',
    templateUrl: './orderacknowledgment.component.html',
    styleUrls: ['./orderacknowledgment.component.scss']
})
export class OrderacknowledgmentComponent implements OnInit {
    authenticationDetails: AuthenticationDetails;
    CurrentUserName: string;
    BGClassName: any;
    displayedColumns: string[] = [
        'select',
        'Item',
        'SLine',
        'Material',
        'MaterialDescription',
        'DeliveryDate',
        'AcceptedDate',
        'POQuantity',
        'AcceptedQuantity',
        'UOM',
        'NetPrice'
    ];
    attachmentColumns: string[] = ['AttachmentNumber', 'AttachmentName', 'DocumentType', 'Delete'];
    OrderAcknowledgmentDataSource = new BehaviorSubject<AbstractControl[]>([]);
    // OrderAcknowledgmentList: POOrderScheduleLine[] = [];
    AttachmentDataSource: MatTableDataSource<AttachmentDetails>;
    AttachmentDetailsList: AttachmentDetails[] = [];
    fileToUpload: File;
    fileToUploadList: File[] = [];
    fileUploader: FileUploader;
    @ViewChild('AttachmentTable') AttachmentTable: MatTable<any>;
    selection = new SelectionModel<POOrderScheduleLine>(true, []);
    AcknowledgementDetails: PO_OrderAcknowledgement = new PO_OrderAcknowledgement();
    AcknowledgementAppID: number;
    POId: string;
    Item: string;
    OrderAcknowlegmentGroup: FormGroup;
    OrderAcknowlegmentFormArray: FormArray = this._formBuilder.array([]);
    @ViewChild(MatSort) sort: MatSort;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _masterService: MasterService,
        public dashboardService: DashboardService,
        private _router: Router,
        private dialog: MatDialog,
        public snackBar: MatSnackBar,
        private route: ActivatedRoute
    ) {
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.route.queryParams.subscribe(params => {
            this.POId = params['id'];
            this.Item = params['item'];
        });
    }

    ngOnInit() {
        this.GetAppByName();
        this.GetPOOrderAcknowledgement();
        this.OrderAcknowlegmentGroup = this._formBuilder.group({
            Remarks: ['', Validators.required],
            POOrderScheduleLine: this.OrderAcknowlegmentFormArray
        });
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.CurrentUserName = this.authenticationDetails.userName;
        } else {
            this._router.navigate(['/auth/login']);
        }
        // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        // this.dataSource.sort = this.sort;
        // this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
        // this.dataSource1.sort = this.sort;
        this.isAllSelected();
        this.masterToggle();
        this.checkboxLabel();
        this._fuseConfigService.config
            // .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(config => {
                this.BGClassName = config;
            });
    }
    GetAppByName(): void {
        const AppName = 'OrderAcknowledged';
        this._masterService.GetAppByName(AppName).subscribe(
            data => {
                const OrderACKPP = data as App;
                if (OrderACKPP) {
                    this.AcknowledgementAppID = OrderACKPP.AppID;
                }
            },
            err => {
                console.error(err);
            }
        );
    }
    GetPOOrderAcknowledgement(): void {
        this.dashboardService.GetPOOrderAcknowledgement(this.POId, this.Item).subscribe(
            data => {
                if (data) {
                    this.AcknowledgementDetails = <PO_OrderAcknowledgement>data;
                    this.GetAttachmentViewsByAppID(this.AcknowledgementAppID, this.Item, this.POId);
                    if (this.AcknowledgementDetails.POOrderScheduleLine && this.AcknowledgementDetails.POOrderScheduleLine.length) {
                        this.ClearFormArray(this.OrderAcknowlegmentFormArray);
                        this.AcknowledgementDetails.POOrderScheduleLine.forEach(x => {
                            this.InsertOrderAcknowledgmentFormGroup(x);
                        });
                    } else {
                        this.ResetOrderAcknowlegmenttems();
                    }
                    // this.InsertOrderAcknowledgmentFormGroup(this.AcknowledgementDetails.POOrderScheduleLine);
                    //  this.OrderAcknowledgmentDataSource = new MatTableDataSource(this.AcknowledgementDetails.POOrderScheduleLine);
                    // this.OrderAcknowledgmentDataSource = new MatTableDataSource(this.AcknowledgementDetails.POOrderScheduleLine);
                    // console.log(this.OrderAcknowledgmentDataSource);
                }
            },
            err => {
                console.error(err);
            }
        );
    }
    ClearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }
    ResetOrderAcknowlegmenttems(): void {
        this.ClearFormArray(this.OrderAcknowlegmentFormArray);
        this.OrderAcknowledgmentDataSource.next(this.OrderAcknowlegmentFormArray.controls);
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.OrderAcknowlegmentFormArray.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    // masterToggle() {
    //   this.isAllSelected() ?
    //     this.selection.clear() :
    //     this.OrderAcknowledgmentDataSource..foreach(function (this.selection.select(row)))
    // //  this.OrderAcknowlegmentFormArray.data.forEach(row => this.selection.select(row));
    // }
    masterToggle() {
        this.isAllSelected()? // this.selection.clear() :
              this.selection.clear()
            : FormArray;
        {
            return this.OrderAcknowlegmentFormArray.value.forEach(row => this.selection.select(row));
        }
        //  this.OrderAcknowledgmentDataSource.data.forEach(row => this.selection.select(row));
    }
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: POOrderScheduleLine): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Item + 1}`;
    }
    ResetAttachements(): void {
        this.AttachmentDetailsList = [];
        this.AttachmentDataSource = new MatTableDataSource(this.AttachmentDetailsList);
        // this.fileUploader = [];
    }
    InsertOrderAcknowledgmentFormGroup(item: POOrderScheduleLine): void {
        const row = this._formBuilder.group({
            Item: [item.Item],
            ScheduleLine: [item.ScheduleLine],
            Material: [item.Material],
            MaterialDescription: [item.MaterialDescription],
            DeliveryDate: [item.DeliveryDate],
            AcceptedDate: [item.AcceptedDate, Validators.required],
            OrderQuantity: [item.OrderQuantity],
            AcceptedQuantity: [item.AcceptedQuantity, Validators.required],
            UOM: [item.UOM],
            NetPrice: [item.NetPrice],
            Status: [item.Status]
        });
        // row.disable();
        row.get('Item').disable();
        row.get('ScheduleLine').disable();
        row.get('DeliveryDate').disable();
        row.get('OrderQuantity').disable();
        row.get('UOM').disable();
        row.get('NetPrice').disable();
        row.get('Material').disable();
        row.get('MaterialDescription').disable();
        if (item.Status === 'Closed') {
            row.get('AcceptedQuantity').disable();
            row.get('AcceptedDate').disable();
        } else {
            row.get('AcceptedQuantity').enable();
            row.get('AcceptedDate').enable();
        }

        this.OrderAcknowlegmentFormArray.push(row);
      //  console.log(this.OrderAcknowlegmentFormArray);
        this.OrderAcknowledgmentDataSource.next(this.OrderAcknowlegmentFormArray.controls);
        this.OrderAcknowlegmentGroup.patchValue({
            PO: item.PO,
            Status: item.Status,
            Created_On: item.Created_On,
            Approved_On: item.Approved_On,
            Approved_By: item.Approved_By
        });
        this.OrderAcknowlegmentGroup.patchValue({
            Remarks: this.AcknowledgementDetails.Remarks
        });
    }

    getRowValues(data): any {
        this.emptyList();
        data.forEach(element => {
            this.AcknowledgementDetails.POOrderScheduleLine.push(element.value);
        });
    }
    emptyList(): void {
        this.AcknowledgementDetails.POOrderScheduleLine = [];
    }

    submitASNDetails(status: string): void {
        this.OrderAcknowlegmentGroup.enable();
        this.getRowValues(this.selection.selected);
        const dialogConfig: MatDialogConfig = {
            data: {
                Actiontype: 'Create',
                Catagory: 'Acknowledgement Details'
            }
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // this.AcknowledgementDetails.POOrderScheduleLine.forEach(element => {
                this.AcknowledgementDetails.Status = status;
                this.AcknowledgementDetails.Item = this.Item;
                this.AcknowledgementDetails.Remarks = this.OrderAcknowlegmentGroup.get('Remarks').value;
                // this.GetAcknowledgmentDetailvalues();
                this.dashboardService.CreateOrderAcknowledgement(this.AcknowledgementDetails).subscribe(
                    data => {
                        // const TransID = data as number;
                        const aux = new Auxiliary();
                        aux.APPID = this.AcknowledgementAppID;
                        aux.APPNumber = parseInt(this.Item);
                        aux.HeaderNumber = this.POId;
                        aux.CreatedBy = this.CurrentUserName;

                        this.dashboardService.AddOrderAcknowledgementAttachment(aux, this.fileToUploadList).subscribe(
                            dat => {
                                // this.IsProgressBarVisibile = false;
                                // this.ResetControl();
                                // this.ResetSelectedPO();
                                this.notificationSnackBarComponent.openSnackBar(
                                    'Acknowledgement details updated successfully',
                                    SnackBarStatus.success
                                );
                                // this.GetAllASNHeaderViews();
                                // this.GetAllAcknowledgedPOViews();
                                // this.GetAllPOByAckAndASNStatus();
                                // this.getAllVendorLocations();
                            },
                            err => {
                                console.error(err);
                                // this.IsProgressBarVisibile = false;
                                this.notificationSnackBarComponent.openSnackBar(
                                    err instanceof Object ? 'Something went wrong' : err,
                                    SnackBarStatus.danger
                                );
                            }
                        );
                        this.GetPOOrderAcknowledgement();
                    },
                    err => {
                        // console.error(err);
                        // this.IsProgressBarVisibile = false;
                        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                    }
                );
                // });
            } else {
                this.GetPOOrderAcknowledgement();
            }
        });
    }

    BackToDashboard(): void {
        this._router.navigate(['/dashboard']);
        // { queryParams: { id: this.POId } }
    }
    GetAttachmentViewsByAppID(APPID: number, item: string, PO: string): void {
        this.dashboardService.GetAttachmentViewsByAppID(APPID, item, PO).subscribe(
            data => {
                this.AttachmentDetailsList = data as AttachmentDetails[];
                this.AttachmentDataSource = new MatTableDataSource(this.AttachmentDetailsList);
                if (this.AttachmentDetailsList && this.AttachmentDetailsList.length) {
                    this.AttachmentDetailsList.forEach(f => {
                        this.fileToUpload = new File([''], f.AttachmentName, { type: f.DocumentType });
                        this.fileToUploadList.push(this.fileToUpload);
                    });
                }
            },
            err => {
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

export interface OrderAcknowledgment {
    Remarks: string;
    Item: string;
    PurchaseOrderQuantity: string;
    UnitOfMeasurement: string;
    NetPrice: string;
}
export interface AttachmentDetails {
    AttachmentNumber: number;
    AttachmentName: string;
    DocumentType: string;
}
const ELEMENT_DATA: OrderAcknowledgment[] = [
    { Remarks: '', Item: '10', PurchaseOrderQuantity: '10000', UnitOfMeasurement: 'EA', NetPrice: '5.0' },
    { Remarks: '', Item: '10', PurchaseOrderQuantity: '10000', UnitOfMeasurement: 'EA', NetPrice: '5.0' }
];
const ELEMENT_DATA1: AttachmentDetails[] = [{ AttachmentNumber: null, AttachmentName: null, DocumentType: null }];
