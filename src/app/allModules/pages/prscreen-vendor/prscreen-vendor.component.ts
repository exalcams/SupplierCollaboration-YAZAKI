import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-prscreen-vendor',
  templateUrl: './prscreen-vendor.component.html',
  styleUrls: ['./prscreen-vendor.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  // animations: fuseAnimations
})
export class PRScreenVendorComponent implements OnInit {
  PRClassList: PRClass[] = [];
  displayedColumns: string[] = ['Item', 'MaterialDescription', 'OrderQuantity', 'DelayDays', 'UOM', 'Price', 'SupplierPartNo', 'Schedule', 'Attachment', 'Forms', 'TechRating'];
  dataSource: MatTableDataSource<PRClass>;
  constructor() { }

  ngOnInit(): void {
    this.PRClassList = [
      {
        Item: 10, MaterialDescription: '', OrderQuantity: 10.00, DelayDays: 7, UOM: 'EA', Price: 85.56,
        SupplierPartNo: 'Material manufactured', Schedule: 2, Attachment: 2, Forms: 4, TechRating: 'NA'
      },
      {
        Item: 20, MaterialDescription: '', OrderQuantity: 10.00, DelayDays: 7, UOM: 'EA', Price: 85.56,
        SupplierPartNo: 'Material manufactured', Schedule: 2, Attachment: 2, Forms: 4, TechRating: 'NA'
      }
    ];
    this.dataSource = new MatTableDataSource(this.PRClassList);
  }

}

export class PRClass {
  Item: number;
  MaterialDescription: string;
  OrderQuantity: number;
  DelayDays: number;
  UOM: string;
  Price: number;
  SupplierPartNo: string;
  Schedule: number;
  Attachment: number;
  Forms: number;
  TechRating: string;
}
