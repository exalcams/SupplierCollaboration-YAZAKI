import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from 'app/services/dashboard.service';
import { PO_OrderAcknowledgement } from 'app/models/dashboard';

@Component({
  selector: 'app-orderacknowledgment',
  templateUrl: './orderacknowledgment.component.html',
  styleUrls: ['./orderacknowledgment.component.scss']
})
export class OrderacknowledgmentComponent implements OnInit {
  BGClassName: any;
  displayedColumns: string[] = ['select', 'Item', 'PurchaseOrderQuantity', 'UnitOfMeasurement', 'NetPrice', 'Remarks'];
  displayedColumns1: string[] = ['AttachmentNumber', 'AttachmentName', 'DocumentType', 'Delete'];
  dataSource: MatTableDataSource<OrderAcknowledgment>;
  dataSource1: MatTableDataSource<AttachmentDetails>;
  selection = new SelectionModel<OrderAcknowledgment>(true, []);
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
          // this.POItemList = new MatTableDataSource(this.POPurchaseOrderDetails.POItemList);
          // console.log(this.POPurchaseOrderDetails)
        }
      },
        (err) => {
          console.error(err);
        })
    })
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
    this.dataSource1.sort = this.sort;
    this.isAllSelected();
    this.masterToggle();
    this.checkboxLabel();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: OrderAcknowledgment): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Item + 1}`;
  }
  BackToDashboard(): void {
    this._router.navigate(['/dashboard']);
    // { queryParams: { id: this.POId } }
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
