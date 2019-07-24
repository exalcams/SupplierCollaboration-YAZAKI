import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.scss']
})
export class PurchaseOrderDetailsComponent implements OnInit {

  displayedColumns: string[] = ['select', 'Item', 'Material', 'Description', 'PurchaseQuantity', 'OrderUnit', 'Currency'];
  displayedColumns1: string[] = ['Item', 'Description', 'ScheduleLine', 'DeliveryDate', 'ScheduleQuantity', 'UOM'];
  dataSource: MatTableDataSource<ItemDetails>;
  dataSource1: MatTableDataSource<ItemDetails1>;
  selection: SelectionModel<ItemDetails>;
  BGClassName:any;
  constructor(private _fuseConfigService: FuseConfigService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
    this.selection = new SelectionModel(true, []);
    this.isAllSelected();
    this.masterToggle();
    this.checkboxLabel();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
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
  checkboxLabel(row?: ItemDetails): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Item + 1}`;
  }
}

export interface ItemDetails {
  Item: string;
  Material: string;
  Description: string;
  PurchaseQuantity: string;
  OrderUnit: string;
  Currency: string;
  select: boolean;
}
export interface ItemDetails1 {
  Item: string;
  ScheduleLine: string;
  Description: string;
  DeliveryDate: string;
  ScheduleQuantity: string;
  UOM: string;
}
const ELEMENT_DATA: ItemDetails[] = [
  { Item: '10', Material: 'Vegetables', Description: 'data', PurchaseQuantity: "900.00", OrderUnit: 'KG', Currency: 'INR', select: false }
];
const ELEMENT_DATA1: ItemDetails1[] = [
  { Item: '10', ScheduleLine: '1', Description: 'data', DeliveryDate: "23-05-2019", ScheduleQuantity: '10.00', UOM: 'KG' }
];
// ['Item', 'Description', 'ScheduleLine', 'DeliveryDate', 'ScheduleQuantity','UOM'];