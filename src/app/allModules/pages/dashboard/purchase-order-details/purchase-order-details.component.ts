import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PO_PurchaseOrderDetails, PO_Item, PO_ScheduleDetails, PO_AdvanceShipmentNotification, PO_GRN, PO_OrderLookUpDetails } from 'app/models/dashboard';
import { DashboardService } from 'app/services/dashboard.service';

@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.scss']
})
export class PurchaseOrderDetailsComponent implements OnInit {

  displayedColumns: string[] = ['Item', 'Material', 'Description', 'PurchaseQuantity', 'OrderUnit', 'Currency'];
  displayedColumns1: string[] = ['Item', 'Description', 'ScheduleLine', 'DeliveryDate', 'ScheduleQuantity', 'UOM'];
  ScheduleDisplayedColumns: string[] = ['Item', 'Description', 'ScheduleLine', 'DeliveryDate', 'ScheduleQuantity', 'UOM'];
  AdvanceShipmentDisplayedColumns: string[] = ['Item', 'Material', 'Description', 'UOM', 'ShipmentQuantity', 'ASNStatus'];
  GRNDisplayedColumns: string[] = ['Item', 'Material', 'Description', 'UOM', 'PostingDate', 'DeliveredQuantity', 'Status'];
  POItemList: MatTableDataSource<PO_Item>;
  PO_ScheduleDetailsList: MatTableDataSource<PO_ScheduleDetails>;
  PO_AdvanceShipmentNotificationList: MatTableDataSource<PO_AdvanceShipmentNotification>;
  PO_GRNList: MatTableDataSource<PO_GRN>;
  dataSource1: MatTableDataSource<ItemDetails1>;
  PO_OrderLookUpDetails: PO_OrderLookUpDetails = new PO_OrderLookUpDetails();
  selection: SelectionModel<PO_Item>;
  selectedPORow: PO_Item = new PO_Item();
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
          if (this.POPurchaseOrderDetails.POItemList && this.POPurchaseOrderDetails.POItemList.length) {
            this.Checked(this.POPurchaseOrderDetails.POItemList[0]);
          }
          // console.log(this.POPurchaseOrderDetails);
        }
      },
        (err) => {
          console.error(err);
        });
    });
  }

  ngOnInit(): void {
    this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
    this.selection = new SelectionModel(true, []);
    // this.PO_OrderLookUpDetails;
    this.PO_ScheduleDetailsList = new MatTableDataSource(this.PO_OrderLookUpDetails.PO_ScheduleDetails);
    this.PO_AdvanceShipmentNotificationList = new MatTableDataSource(this.PO_OrderLookUpDetails.PO_AdvanceShipmentNotification);
    this.PO_GRNList = new MatTableDataSource(this.PO_OrderLookUpDetails.PO_GRN);
    this._fuseConfigService.config
      .subscribe((config) => {
        this.BGClassName = config;
      });
  }
  BackToDashboard(): void {
    this._router.navigate(['/dashboard']);
    // , { queryParams: { id: this.POId } }

  }
  Checked(data): void {
    this.selectedPORow = data;
    this.dashboardService.GetPOOrderLookUpDetails(this.selectedPORow.PO_Item_PO, this.selectedPORow.Item).subscribe((data1) => {
      if (data1) {
        this.PO_OrderLookUpDetails = data1 as PO_OrderLookUpDetails;
        this.PO_ScheduleDetailsList = new MatTableDataSource(this.PO_OrderLookUpDetails.PO_ScheduleDetails);
        this.PO_AdvanceShipmentNotificationList = new MatTableDataSource(this.PO_OrderLookUpDetails.PO_AdvanceShipmentNotification);
        this.PO_GRNList = new MatTableDataSource(this.PO_OrderLookUpDetails.PO_GRN);
        // console.log(this.PO_ScheduleDetailsList);
        // console.log(this.PO_AdvanceShipmentNotificationList);
        // console.log(this.PO_GRNList);
      }
    },
      (err) => {
        console.error(err);
      });
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
