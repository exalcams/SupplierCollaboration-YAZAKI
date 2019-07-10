import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-orderacknowledgment',
  templateUrl: './orderacknowledgment.component.html',
  styleUrls: ['./orderacknowledgment.component.scss']
})
export class OrderacknowledgmentComponent implements OnInit {

  displayedColumns: string[] = ['select', 'Item', 'PurchaseOrderQuantity', 'UnitOfMeasurement', 'NetPrice','Remarks'];
  displayedColumns1: string[] = ['AttachmentNumber', 'AttachmentName', 'DocumentType', 'Delete'];
  dataSource: MatTableDataSource<OrderAcknowledgment>;
  dataSource1: MatTableDataSource<AttachmentDetails>;
  selection = new SelectionModel<OrderAcknowledgment>(true, []);
  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
    this.isAllSelected();
    this.masterToggle();
    this.checkboxLabel();
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

}

export interface OrderAcknowledgment {
  Remarks: string;
  Item: string;
  PurchaseOrderQuantity: string;
  UnitOfMeasurement: string;
  NetPrice:string;
}
export interface AttachmentDetails {
  AttachmentNumber: number;
  AttachmentName: string;
  DocumentType: string;
}
const ELEMENT_DATA: OrderAcknowledgment[] = [
  { Remarks: '', Item: '10', PurchaseOrderQuantity: '10000', UnitOfMeasurement: 'EA',NetPrice:'5.0' },
  { Remarks: '', Item: '10', PurchaseOrderQuantity: '10000', UnitOfMeasurement: 'EA',NetPrice:'5.0' }
];
const ELEMENT_DATA1: AttachmentDetails[] = [
  { AttachmentNumber: null, AttachmentName: null, DocumentType: null }
];
