import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  // animations: fuseAnimations
})
export class CreationComponent implements OnInit {
  PRClassList: PRClass[] = [];
  BGClassName: any;
  displayedColumns: string[] = ['Item', 'MaterialDescription', 'OrderQuantity', 'DelayDays', 'UOM', 'Price', 'SupplierPartNo', 'Schedule', 'Attachment', 'Forms', 'TechRating'];
  dataSource: MatTableDataSource<PRClass>;
  constructor(private _fuseConfigService: FuseConfigService) { }

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
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
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
