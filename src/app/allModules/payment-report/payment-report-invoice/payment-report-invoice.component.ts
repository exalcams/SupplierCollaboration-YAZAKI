import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-payment-report-invoice',
  templateUrl: './payment-report-invoice.component.html',
  styleUrls: ['./payment-report-invoice.component.scss']
})
export class PaymentReportInvoiceComponent implements OnInit {
  displayedColumns: string[] = ['select', 'PurchasingDocument', 'DocumentDate', 'Reference', 'Amount', 'ClearingDocument', 'PostingDate', 'Currency', 'PaymentDocumentNo', 'PaymentDate', 'AmountPaid'];
  dataSource: MatTableDataSource<PaymentReportInvoice>;
  selection: SelectionModel<PaymentReportInvoice>;
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
  checkboxLabel(row?: PaymentReportInvoice): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Reference + 1}`;
  }
}

export interface PaymentReportInvoice {
  PurchasingDocument: string;
  DocumentDate: string;
  Reference: string;
  Amount: string;
  ClearingDocument: string;
  PostingDate: string;
  Currency: string;
  PaymentDocumentNo: string;
  PaymentDate: string;
  AmountPaid: string;
  select: boolean;
}
const ELEMENT_DATA: PaymentReportInvoice[] = [
  { PurchasingDocument: '8001002366', DocumentDate: '2019-06-21', Reference: '139', Amount: "94500.00", ClearingDocument: '530000012', PostingDate: '2019-06-21', Currency: 'INR', PaymentDocumentNo: '400000012', PaymentDate: '2019-06-21', AmountPaid: '94500.00',select:false }
];