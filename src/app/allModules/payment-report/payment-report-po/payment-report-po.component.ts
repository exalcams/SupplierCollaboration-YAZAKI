import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-payment-report-po',
  templateUrl: './payment-report-po.component.html',
  styleUrls: ['./payment-report-po.component.scss']
})
export class PaymentReportPoComponent implements OnInit {

  displayedColumns: string[] = ['select', 'PurchasingDocument', 'DocumentDate', 'Reference', 'Amount', 'ClearingDocument', 'PostingDate', 'Currency', 'PaymentDocumentNo', 'PaymentDate', 'PmntadviceNo', 'AmountPaid'];
  dataSource: MatTableDataSource<PaymentReportPO>;
  selection: SelectionModel<PaymentReportPO>;
  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.selection = new SelectionModel(true, []);
    this.isAllSelected();
    this.masterToggle();
    this.checkboxLabel();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PaymentReportPO): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Reference + 1}`;
  }
}

export interface PaymentReportPO {
  PurchasingDocument: string;
  DocumentDate: string;
  Reference: string;
  Amount: string;
  ClearingDocument: string;
  PostingDate: string;
  Currency: string;
  PaymentDocumentNo: string;
  PaymentDate: string;
  PmntadviceNo: string;
  AmountPaid: string;
  select: boolean;
}
const ELEMENT_DATA: PaymentReportPO[] = [
  { PurchasingDocument: '8001002366', DocumentDate: '2019-06-21', Reference: '139', Amount: "94500.00", ClearingDocument: '530000012', PostingDate: '2019-06-21', Currency: 'INR', PaymentDocumentNo: '400000012', PaymentDate: '2019-06-21', PmntadviceNo: '135478900125', AmountPaid: '94500.00',select:false }
];
// ['select','PurchasingDocument', 'DocumentDate', 'Reference', 'Amount', 'ClearingDocument', 'Amount', 'PostingDate', 'Currency', 'PaymentDocumentNo', 'PaymentDate', 'PmntadviceNo','AmountPaid'];