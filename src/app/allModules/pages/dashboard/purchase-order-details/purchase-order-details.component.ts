import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PO_PurchaseOrderDetails, PO_Item } from 'app/models/dashboard';
import { DashboardService } from 'app/services/dashboard.service';

@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.scss']
})
export class PurchaseOrderDetailsComponent implements OnInit {

  displayedColumns: string[] = ['select', 'Item', 'Material', 'Description', 'PurchaseQuantity', 'OrderUnit', 'Currency'];
  displayedColumns1: string[] = ['Item', 'Description', 'ScheduleLine', 'DeliveryDate', 'ScheduleQuantity', 'UOM'];
  POItemList: MatTableDataSource<PO_Item>;
  dataSource1: MatTableDataSource<ItemDetails1>;
  selection: SelectionModel<PO_Item>;
  POId: any;
  POPurchaseOrderDetails: PO_PurchaseOrderDetails = new PO_PurchaseOrderDetails();
  BGClassName: any;
  constructor(private _fuseConfigService: FuseConfigService, private route: ActivatedRoute, public dashboardService: DashboardService, private _router: Router, ) {
    this.route.queryParams.subscribe(params => {
      this.POId = params['id'];
      this.dashboardService.GetPOPurchaseOrderDetails(this.POId).subscribe((data) => {
        if (data) {
          this.POPurchaseOrderDetails = <PO_PurchaseOrderDetails>data;
          this.POItemList = new MatTableDataSource(this.POPurchaseOrderDetails.POItemList);
          console.log(this.POPurchaseOrderDetails)
        }
      },
        (err) => {
          console.error(err);
        })
    })
  }

  ngOnInit() {
    this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
    this.selection = new SelectionModel(true, []);
    this._fuseConfigService.config
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }
  BackToDashboard(): void {
    this._router.navigate(['/dashboard']);
    // , { queryParams: { id: this.POId } }
    
  }
}

export interface ItemDetails1 {
  Item: string;
  ScheduleLine: string;
  Description: string;
  DeliveryDate: string;
  ScheduleQuantity: string;
  UOM: string;
}

const ELEMENT_DATA1: ItemDetails1[] = [
  { Item: '10', ScheduleLine: '1', Description: 'data', DeliveryDate: "23-05-2019", ScheduleQuantity: '10.00', UOM: 'KG' }
];
