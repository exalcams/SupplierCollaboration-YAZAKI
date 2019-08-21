import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { PO_OrderAcknowledgement, POOrderScheduleLine } from 'app/models/dashboard';
import { FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-orderacknowledgment',
  templateUrl: './orderacknowledgment.component.html',
  styleUrls: ['./orderacknowledgment.component.scss']
})
export class OrderacknowledgmentComponent implements OnInit {
  BGClassName: any;
  displayedColumns: string[] = ['select','Item', 'SLine', 'Material', 'MaterialDescription', 'DeliveryDate', 'AcceptedDate', 'POQuantity', 'AcceptedQuantity', 'UOM', 'NetPrice'];
  attachmentColumns: string[] = ['AttachmentNumber', 'AttachmentName', 'DocumentType', 'Delete'];
  OrderAcknowledgmentDataSource: MatTableDataSource<POOrderScheduleLine>;
 // OrderAcknowledgmentList: POOrderScheduleLine[] = [];
  AttachmentDataSource: MatTableDataSource<AttachmentDetails>;
  AttachmentDetailsList: AttachmentDetails[] = [];
  fileToUpload: File;
  fileToUploadList: File[] = [];
  fileUploader: FileUploader;
  @ViewChild('AttachmentTable') AttachmentTable: MatTable<any>;
  selection = new SelectionModel<POOrderScheduleLine>(true, []);
  AcknowledgementDetails: PO_OrderAcknowledgement = new PO_OrderAcknowledgement();
  POId: string;
  Item: string;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _fuseConfigService: FuseConfigService, public dashboardService: DashboardService, private _router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.POId = params['id'];
      this.Item = params['item'];
      this.dashboardService.GetPOOrderAcknowledgement(this.POId, this.Item).subscribe((data) => {
        if (data) {
          this.AcknowledgementDetails = <PO_OrderAcknowledgement>data;
          console.log(this.AcknowledgementDetails);
          this.OrderAcknowledgmentDataSource = new MatTableDataSource(this.AcknowledgementDetails.POOrderScheduleLine);
          // this.OrderAcknowledgmentDataSource = new MatTableDataSource(this.AcknowledgementDetails.POOrderScheduleLine);
           console.log(this.OrderAcknowledgmentDataSource);
        }
      },
        (err) => {
          console.error(err);
        })
    })
  }

  ngOnInit() {
    // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    // this.dataSource.sort = this.sort;
    // this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
    // this.dataSource1.sort = this.sort;
    // this.isAllSelected();
    // this.masterToggle();
    // this.checkboxLabel();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }

  // /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.OrderAcknowledgmentDataSource.data.length;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.OrderAcknowledgmentDataSource.data.forEach(row => this.selection.select(row));
  // }
  ResetAttachements(): void {
    this.AttachmentDetailsList = [];
    this.AttachmentDataSource = new MatTableDataSource(this.AttachmentDetailsList);
    // this.fileUploader = [];
  }
  // /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: POOrderScheduleLine): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Item + 1}`;
  // }
  BackToDashboard(): void {
    this._router.navigate(['/dashboard']);
    // { queryParams: { id: this.POId } }
  }
  GetAttachmentViewsByAppID(APPID: number, APPNumber: number): void {
    this.dashboardService.GetAttachmentViewsByAppID(APPID, APPNumber).subscribe(
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
const ELEMENT_DATA1: AttachmentDetails[] = [
  { AttachmentNumber: null, AttachmentName: null, DocumentType: null }
];
