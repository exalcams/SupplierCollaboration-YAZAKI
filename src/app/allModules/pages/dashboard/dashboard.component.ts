import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar, MatTableDataSource, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/master';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  BGClassName: any;
  displayedColumns: string[] = ['select', 'PO', 'PurchaseOrder', 'Item', 'PODate', 'Material', 'Description', 'POQuantity', 'OrderUnit', 'QAStatus', 'ASNStatus', 'Attechment'];
  displayedColumns1: string[] = ['DraftID', 'ServiceEnterSheetID', 'PurchaseOrder', 'Amount'];
  dataSource: MatTableDataSource<OrderFullfillment>;
  dataSource1: MatTableDataSource<PreviousRequests>;
  selection: SelectionModel<OrderFullfillment>;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  public isVisible: boolean;
  selected1 = 'option1';
  // private LinItemList: LineItems[];
  public OrderList: Orders[];
  // displayedColumns: string[] = ['Description', 'Quantity', 'Rate'];
  // displayedColumns1: string[] = ['Description', 'Quantity', 'Status'];
  widget5: any = {};
  selected = 'Month';
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _fuseConfigService: FuseConfigService,
    private _router: Router,
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public snackBar: MatSnackBar) {
    matIconRegistry.addSvgIcon('pdficon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/dashboard/pdf.svg'));
    matIconRegistry.addSvgIcon('questionmarkicon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/dashboard/noun-help-922772.svg'));
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);

    this.widget5 = {

      data: {
        labels: ['0', '10', '20', '30', '40', '50', '60', '70'],
        datasets: [
          {
            type: 'line',
            label: '',
            data: [15, 37, 5, 60, 50, 75, 35, 15],
            fill: false,
            lineTension: 0.4,
            borderColor: ['#2979ff'],
            // pointBorderColor: "#71a5e2",
            pointRadius: 1,
            // pointHoverRadius: 7,
            // pointBorderWidth: 5,
            // pointBorderColor: '#ffffff',
            pointBackgroundColor: "#2979ff",
            // borderWidth: 1
          },
          {
            type: 'line',
            label: '',
            data: [20, 70, 27, 38, 22, 65, 22, 19],
            fill: false,
            lineTension: 0.4,
            borderColor: ['#e32049'],
            // pointBorderColor: "#71a5e2",
            pointRadius: 1,
            // pointHoverRadius: 7,
            // pointBorderWidth: 5,
            // pointBorderColor: '#ffffff',
            pointBackgroundColor: "#e32049",
            // borderWidth: 1
          },
        ],
      },
      options: {
        title: {
          text: '',
          display: true
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            barPercentage: 0.3,
            gridLines: {
              display: false
            },
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              gridLines: {
                display: false
              },
              stepSize: 40,

            }
          }]
        },
      }
    }
  }

  ngOnInit(): void {
    // Retrive authorizationData
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
    this.dataSource1.sort = this.sort;
    this.selection = new SelectionModel(true, []);
    this.isAllSelected();
    this.masterToggle();
    this.checkboxLabel();
    this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.BGClassName = config;
      });
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('Dashboard') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.isVisible = false;
    this.OrderList = [
      {
        OrderID: 12345, OrderedDate: new Date(), Place: 'Chennai', TotalAmount: 56000, DueDate: new Date('05/05/2019'), IsVisible: false,
        LineItemsList: [
          { ItemID: 1, Description: 'Carrier 1.5 Ton 3 star (2018) Split AC (Copper,White)', Quantity: 1, Rate: 24, Status: 'In Production' },
          { ItemID: 2, Description: 'VGaurd VG 400 AE 10 Stabilizer (White)', Quantity: 1, Rate: 24, Status: 'Ready to be packed' }
        ]
      },
      {
        OrderID: 1357, OrderedDate: new Date(), Place: 'Bangalore', TotalAmount: 56000, DueDate: new Date('05/05/2019'), IsVisible: false,
        LineItemsList: [
          { ItemID: 1, Description: 'Carrier 1.5 Ton 3 star (2018) Split AC (Copper,White)', Quantity: 1, Rate: 24, Status: 'In Production' },
          { ItemID: 2, Description: 'VGaurd VG 400 AE 10 Stabilizer (White)', Quantity: 1, Rate: 24, Status: 'Ready to be packed' }
        ]
      },
      {
        OrderID: 10000, OrderedDate: new Date(), Place: 'Mumbai', TotalAmount: 56000, DueDate: new Date('05/05/2019'), IsVisible: false,
        LineItemsList: [
          { ItemID: 1, Description: 'Carrier 1.5 Ton 3 star (2018) Split AC (Copper,White)', Quantity: 1, Rate: 24, Status: 'In Production' },
          { ItemID: 2, Description: 'VGaurd VG 400 AE 10 Stabilizer (White)', Quantity: 1, Rate: 24, Status: 'Ready to be packed' }
        ]
      }
    ];
  }

  ChangeVisibleStatus(SelectedOrder: Orders): void {
    SelectedOrder.IsVisible = !SelectedOrder.IsVisible;
  }
  CalculateSum(SelectedOrder: Orders): number {
    let sum = 0;
    SelectedOrder.LineItemsList.forEach(x => {
      sum = sum + x.Rate;
    });
    return sum;
  }

  filterForeCasts(filterVal: any) {
    this.selected = filterVal;
    //alert(filterVal);
    // if (selected == "0")
    //    this.selected;
    // else
    // this.forecasts = this.cacheForecasts.filter((item) => item.summary == filterVal); 
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
  checkboxLabel(row?: OrderFullfillment): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.POQuantity + 1}`;
  }
  PurchaseOrder() {
    this._router.navigate(['/dashboard/purchaseOrderDetails']);
  }
  // router.navigate(['/dashboard/purchaseOrderDetails']);
}

export class LineItems {
  ItemID: number;
  Description: string;
  Quantity: number;
  Rate: number;
  Status: string;
}

export class Orders {
  OrderID: number;
  OrderedDate: Date;
  Place: string;
  TotalAmount: number;
  DueDate: Date;
  IsVisible?: boolean;
  LineItemsList?: LineItems[];
}
export interface OrderFullfillment {
  PO: string;
  PurchaseOrder: string;
  Item: string;
  PODate: string;
  Material: string;
  Description: string;
  POQuantity: number;
  OrderUnit: string;
  QAStatus: string;
  ASNStatus: string;
  Attechment: string;
  select: boolean;
}
export interface PreviousRequests {
  DraftID: number;
  ServiceEnterSheetID: string;
  PurchaseOrder: string;
  Amount: string;
}
const ELEMENT_DATA: OrderFullfillment[] = [
  { PO: '10', PurchaseOrder: '8001002118', Item: '10', PODate: "2019-06-21", Material: 'Vegetables', Description: 'data', POQuantity: 100.00, OrderUnit: 'Kg', QAStatus: 'Oky', ASNStatus: 'Errors', Attechment: '', select: false },
  { PO: '10', PurchaseOrder: '8001002118', Item: '10', PODate: "2019-06-21", Material: 'Vegetables', Description: 'data', POQuantity: 100.00, OrderUnit: 'Kg', QAStatus: 'Oky', ASNStatus: 'Errors', Attechment: '', select: false },
  { PO: '10', PurchaseOrder: '8001002118', Item: '10', PODate: "2019-06-21", Material: 'Vegetables', Description: 'data', POQuantity: 100.00, OrderUnit: 'Kg', QAStatus: 'Oky', ASNStatus: 'Errors', Attechment: '', select: false },
  { PO: '10', PurchaseOrder: '8001002118', Item: '10', PODate: "2019-06-21", Material: 'Vegetables', Description: 'data', POQuantity: 100.00, OrderUnit: 'Kg', QAStatus: 'Oky', ASNStatus: 'Errors', Attechment: '', select: false },
  { PO: '10', PurchaseOrder: '8001002118', Item: '10', PODate: "2019-06-21", Material: 'Vegetables', Description: 'data', POQuantity: 100.00, OrderUnit: 'Kg', QAStatus: 'Oky', ASNStatus: 'Errors', Attechment: '', select: false },
  { PO: '10', PurchaseOrder: '8001002118', Item: '10', PODate: "2019-06-21", Material: 'Vegetables', Description: 'data', POQuantity: 100.00, OrderUnit: 'Kg', QAStatus: 'Oky', ASNStatus: 'Errors', Attechment: '', select: false },

];
const ELEMENT_DATA1: PreviousRequests[] = [
  { DraftID: 102654, PurchaseOrder: '8001002118', ServiceEnterSheetID: '10', Amount: '25411.00' }
];
