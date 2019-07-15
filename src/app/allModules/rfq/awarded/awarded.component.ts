import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'awarded',
  templateUrl: './awarded.component.html',
  styleUrls: ['./awarded.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AwardedComponent implements OnInit {

  VendorComparsionClassList: VendorComparsionClass[] = [];
  displayedColumns: string[] = ['VendorName', 'ItemDescription', 'Quantity', 'UOM', 'DelayDays', 'BestFor'];
  dataSource: MatTableDataSource<VendorComparsionClass>;

  constructor() { }

  ngOnInit(): void {
    this.VendorComparsionClassList = [
      {
        VendorName: 'Exalca Technologies',  VendorCode: '80091', ItemDescription: 'Supplier success portal service', Quantity: 1.00, 
        UOM: 'EA', DelayDays: 2, BestFor: 'money-bag'
      },
      {
        VendorName: 'Exalca Technologies',  VendorCode: '80056', ItemDescription: 'Supplier success portal service', Quantity: 1.00, 
        UOM: 'EA', DelayDays: 2, BestFor: 'calendar-color'
      },
      {
        VendorName: 'Exalca Technologies',  VendorCode: '80050', ItemDescription: 'Supplier success portal service', Quantity: 1.00, 
        UOM: 'EA', DelayDays: 2, BestFor: 'star'
      }
    ];
    this.dataSource = new MatTableDataSource(this.VendorComparsionClassList);
  }

}
export class VendorComparsionClass {
  VendorName: string;
  VendorCode: string;
  ItemDescription: string;
  Quantity: number;
  UOM: string;
  DelayDays: number;
  BestFor: string;
}
