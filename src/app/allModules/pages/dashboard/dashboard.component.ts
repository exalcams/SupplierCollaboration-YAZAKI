import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar, MatTableDataSource, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/master';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseConfigService } from '@fuse/services/config.service';
import { DashboardService } from 'app/services/dashboard.service';
import { PO_Notifications, DashboardStatus, PO_DeliveryStatus, PO_PurchaseOrderDetails, POView } from 'app/models/dashboard';
import { ASNService } from 'app/services/asn.service';
import { ASN } from 'app/models/asn';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    showChart = false;
    BGClassName: any;
    displayedColumns: string[] = [
        'PurchaseOrder',
        'Item',
        'PODate',
        'Material',
        'Description',
        'POQuantity',
        'OrderUnit',
        'QAStatus',
        'ASNStatus',
        'Attechment'
    ];
    displayedColumns1: string[] = ['TransId', 'PurchaseOrder', 'Status'];
    AllPOList: POView[] = [];
    IsProgressBarVisibile: boolean;
    DeliveryStatus: string;
    ASNHeaderList: ASN[] = [];
    POListDataSource: MatTableDataSource<POView>;
    IsAllPOListCompleted: boolean;
    ASNHeaderDataSource: MatTableDataSource<ASN>;
    selection: SelectionModel<POView>;
    authenticationDetails: AuthenticationDetails;
    MenuItems: string[];
    notificationSnackBarComponent: NotificationSnackBarComponent;
    public isVisible: boolean;
    PONotifications: PO_Notifications = new PO_Notifications();
    DashbordStatus: DashboardStatus = new DashboardStatus();
    PODeliveryStatus: PO_DeliveryStatus = new PO_DeliveryStatus();
    selected1 = 'option1';
    selected2 = 'option1';
    iconVisible = false;
    selectedPORow: POView = new POView();
    public OrderList: Orders[];
    widget5: any = {};
    selected = 'Month';
    @ViewChild(MatSort) sort: MatSort;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _router: Router,
        matIconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        public dashboardService: DashboardService,
        public asnService: ASNService,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar
    ) {
        matIconRegistry.addSvgIcon('pdficon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/dashboard/pdf.svg'));
        matIconRegistry.addSvgIcon('questionmarkicon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/dashboard/noun-help-922772.svg'));
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.DeliveryStatus = '7';
        // this.route.queryParams.subscribe(params => {
        //   this.selectedPORow.PO = params['id'];
        //   console.log(this.selectedPORow.PO);

        // })
    }

    ngOnInit(): void {
        this.GetAllPOList();
        this.GetAllPONotifications();
        this.GetAllDashboardStatus();
        this.GetAllPODeliveryStatus();
        this.GetASNHeader();
        this.IsAllPOListCompleted = false;
        // this.dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
        // this.dataSource1.sort = this.sort;
        this.selection = new SelectionModel(false, []);
        this._fuseConfigService.config.subscribe(config => {
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
                OrderID: 12345,
                OrderedDate: new Date(),
                Place: 'Chennai',
                TotalAmount: 56000,
                DueDate: new Date('05/05/2019'),
                IsVisible: false,
                LineItemsList: [
                    {
                        ItemID: 1,
                        Description: 'Carrier 1.5 Ton 3 star (2018) Split AC (Copper,White)',
                        Quantity: 1,
                        Rate: 24,
                        Status: 'In Production'
                    },
                    { ItemID: 2, Description: 'VGaurd VG 400 AE 10 Stabilizer (White)', Quantity: 1, Rate: 24, Status: 'Ready to be packed' }
                ]
            },
            {
                OrderID: 1357,
                OrderedDate: new Date(),
                Place: 'Bangalore',
                TotalAmount: 56000,
                DueDate: new Date('05/05/2019'),
                IsVisible: false,
                LineItemsList: [
                    {
                        ItemID: 1,
                        Description: 'Carrier 1.5 Ton 3 star (2018) Split AC (Copper,White)',
                        Quantity: 1,
                        Rate: 24,
                        Status: 'In Production'
                    },
                    { ItemID: 2, Description: 'VGaurd VG 400 AE 10 Stabilizer (White)', Quantity: 1, Rate: 24, Status: 'Ready to be packed' }
                ]
            },
            {
                OrderID: 10000,
                OrderedDate: new Date(),
                Place: 'Mumbai',
                TotalAmount: 56000,
                DueDate: new Date('05/05/2019'),
                IsVisible: false,
                LineItemsList: [
                    {
                        ItemID: 1,
                        Description: 'Carrier 1.5 Ton 3 star (2018) Split AC (Copper,White)',
                        Quantity: 1,
                        Rate: 24,
                        Status: 'In Production'
                    },
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

    filterForeCasts(filterVal: any): void {
        this.selected = filterVal;
        //alert(filterVal);
        // if (selected == "0")
        //    this.selected;
        // else
        // this.forecasts = this.cacheForecasts.filter((item) => item.summary == filterVal);
    }

    PurchaseOrder(): void {
        if (this.selectedPORow.PO != null) {
            this._router.navigate(['/dashboard/purchaseOrderDetails'], { queryParams: { id: this.selectedPORow.PO } });
        } else {
            this.notificationSnackBarComponent.openSnackBar('Please select the PO ', SnackBarStatus.danger);
        }
    }

    OrderAcknowledgement(): void {
        if (this.selectedPORow.PO != null) {
            this._router.navigate(['/orderacknowledgment/acknowledgment'], {
                queryParams: { id: this.selectedPORow.PO, item: this.selectedPORow.Item }
            });
        } else {
            this.notificationSnackBarComponent.openSnackBar('Please select the PO ', SnackBarStatus.danger);
        }
    }

    AdvanceShipment(): void {
        if (this.selectedPORow.AcknowledgementStatus && this.selectedPORow.AcknowledgementStatus.toLowerCase() === 'closed') {
            this._router.navigate(['/order/shipment'], {
                queryParams: { id: this.selectedPORow.PO, item: this.selectedPORow.Item, status: this.selectedPORow.ASNStatus }
            });
        } else {
            this.notificationSnackBarComponent.openSnackBar('Please acknowledge the PO item', SnackBarStatus.danger);
        }
    }

    GetAllPOList(): void {
        this.dashboardService.GetAllPoList().subscribe(
            data => {
                if (data) {
                    this.AllPOList = <POView[]>data;
                    this.POListDataSource = new MatTableDataSource(this.AllPOList);
                    this.POListDataSource.sort = this.sort;
                }
                this.IsAllPOListCompleted = true;
            },
            err => {
                console.error(err);
            }
        );
    }

    GetASNHeader(): void {
        this.dashboardService.GetASNHeader().subscribe(
            data => {
                if (data) {
                    this.ASNHeaderList = <ASN[]>data;
                    this.ASNHeaderDataSource = new MatTableDataSource(this.ASNHeaderList);
                    this.ASNHeaderDataSource.sort = this.sort;
                }
            },
            err => {
                console.error(err);
            }
        );
    }

    GetAllPONotifications(): void {
        this.dashboardService.GetAllPONotifications().subscribe(
            data => {
                if (data) {
                    this.PONotifications = <PO_Notifications>data;
                }
            },
            err => {
                console.error(err);
            }
        );
    }

    GetAllDashboardStatus(): void {
        this.dashboardService.GetAllDashboardStatus().subscribe(
            data => {
                if (data) {
                    this.DashbordStatus = <DashboardStatus>data;
                }
            },
            err => {
                console.error(err);
            }
        );
    }

    GetAllPODeliveryStatus(): void {
        this.dashboardService.GetAllPODeliveryStatus(this.DeliveryStatus).subscribe(
            data => {
                if (data) {
                    this.PODeliveryStatus = <PO_DeliveryStatus>data;
                   // console.log(this.PODeliveryStatus.Date);
                    this.widget5 = {
                        data: {
                            labels: this.PODeliveryStatus.Date,
                            datasets: [
                                {
                                    type: 'line',
                                    label: '',
                                    data: this.PODeliveryStatus.ExpDateOfArrivalCount,
                                    fill: false,
                                    lineTension: 0.4,
                                    borderColor: ['#2979ff'],
                                    // pointBorderColor: "#71a5e2",
                                    pointRadius: 2,
                                    // pointHoverRadius: 7,
                                    // pointBorderWidth: 5,
                                    // pointBorderColor: '#ffffff',
                                    pointBackgroundColor: '#2979ff'
                                    // borderWidth: 1
                                },
                                {
                                    type: 'line',
                                    label: '',
                                    data: this.PODeliveryStatus.Count,
                                    fill: false,
                                    lineTension: 0.4,
                                    borderColor: ['#e32049'],
                                    // pointBorderColor: "#71a5e2",
                                    pointRadius: 2,
                                    // pointHoverRadius: 7,
                                    // pointBorderWidth: 5,
                                    // pointBorderColor: '#ffffff',
                                    pointBackgroundColor: '#e32049'
                                    // borderWidth: 1
                                }
                            ]
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
                                enabled: true
                            },
                            scales: {
                                xAxes: [
                                    {
                                        barPercentage: 0.3,
                                        valueFormatString: 'DD-MMM',
                                        gridLines: {
                                            display: false
                                        }
                                    }
                                ],
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                            gridLines: {
                                                display: false
                                            },
                                            stepSize: 2
                                        }
                                    }
                                ]
                            }
                        }
                    };

                    this.showChart = true;
                }
            },
            err => {}
        );
    }

    Checked(data): void {
        this.selectedPORow = data;
    }

    exportAsXLSX(): void {
        this.dashboardService.exportAsExcelFile(this.AllPOList, 'PO_List');
    }

    GetShipOpen(): void {
        this.IsProgressBarVisibile = true;
        this.dashboardService.GetToShipOpen().subscribe(
            data => {
                if (data) {
                    this.IsProgressBarVisibile = false;
                    this.AllPOList = <POView[]>data;
                    this.POListDataSource = new MatTableDataSource(this.AllPOList);
                    this.POListDataSource.sort = this.sort;
                }
                this.IsAllPOListCompleted = true;
            },
            err => {
                console.error(err);
            }
        );
    }

    GetToShipWeek(): void {
        this.IsProgressBarVisibile = true;
        this.dashboardService.GetToShipWeek().subscribe(
            data => {
                if (data) {
                    this.IsProgressBarVisibile = false;
                    this.AllPOList = <POView[]>data;
                    this.POListDataSource = new MatTableDataSource(this.AllPOList);
                    this.POListDataSource.sort = this.sort;
                }
                this.IsAllPOListCompleted = true;
            },
            err => {
                console.error(err);
            }
        );
    }

    GetOpenPoList(): void {
        this.IsProgressBarVisibile = true;
        this.dashboardService.GetOpenPoList().subscribe(
            data => {
                if (data) {
                    this.IsProgressBarVisibile = false;
                    this.AllPOList = <POView[]>data;
                    this.POListDataSource = new MatTableDataSource(this.AllPOList);
                    this.POListDataSource.sort = this.sort;
                }
                this.IsAllPOListCompleted = true;
            },
            err => {
                console.error(err);
            }
        );
    }

    GetOpenFromPO(): void {
        this.IsProgressBarVisibile = true;
        this.dashboardService.GetOpenFromPO().subscribe(
            data => {
                if (data) {
                    this.IsProgressBarVisibile = false;
                    this.AllPOList = <POView[]>data;
                    this.POListDataSource = new MatTableDataSource(this.AllPOList);
                    this.POListDataSource.sort = this.sort;
                    console.log(this.AllPOList);
                    console.log(this.POListDataSource.data.length);
                }
                this.IsAllPOListCompleted = true;
            },
            err => {
                console.error(err);
            }
        );
    }

    GetInTransitList(): void {
        this.IsProgressBarVisibile = true;
        this.dashboardService.GetInTransitList().subscribe(
            data => {
                if (data) {
                    this.IsProgressBarVisibile = false;
                    this.AllPOList = <POView[]>data;
                    this.POListDataSource = new MatTableDataSource(this.AllPOList);
                    this.POListDataSource.sort = this.sort;
                }
                this.IsAllPOListCompleted = true;
            },
            err => {
                console.error(err);
            }
        );
    }

    GetInTransitReceivedList(): void {
        this.IsProgressBarVisibile = true;
        this.dashboardService.GetInTransitReceivedList().subscribe(
            data => {
                if (data) {
                    this.IsProgressBarVisibile = false;
                    this.AllPOList = <POView[]>data;
                    this.POListDataSource = new MatTableDataSource(this.AllPOList);
                    this.POListDataSource.sort = this.sort;
                }
                this.IsAllPOListCompleted = true;
            },
            err => {
                console.error(err);
            }
        );
    }

    GetPaymentDueList(): void {
        this.IsProgressBarVisibile = true;
        this.dashboardService.GetPaymentDueList().subscribe(
            data => {
                if (data) {
                    this.IsProgressBarVisibile = false;
                    this.AllPOList = <POView[]>data;
                    this.POListDataSource = new MatTableDataSource(this.AllPOList);
                    this.POListDataSource.sort = this.sort;
                }
                this.IsAllPOListCompleted = true;
            },
            err => {
                console.error(err);
            }
        );
    }

    GetPaymentReceivedList(): void {
        this.IsProgressBarVisibile = true;
        this.dashboardService.GetPaymentReceivedList().subscribe(
            data => {
                if (data) {
                    this.IsProgressBarVisibile = false;
                    this.AllPOList = <POView[]>data;
                    this.POListDataSource = new MatTableDataSource(this.AllPOList);
                    this.POListDataSource.sort = this.sort;
                }
                this.IsAllPOListCompleted = true;
            },
            err => {
                console.error(err);
            }
        );
    }

    ASNDetails(data): void {
        const transId = data.TransID;
        this._router.navigate(['/order/shipment'], {
            queryParams: { transID: transId }
        });
    }
    // ClearChart(): void {
    //     this.widget5 = {
    //         data: {
    //             labels: []
    //         }
    //     };
    // }
    DeliveryStatusChange(): void {
        // this.ClearChart();
        this.PODeliveryStatus.Date = [];
       // console.log(this.PODeliveryStatus.Date);
        this.GetAllPODeliveryStatus();
       // console.log(this.PODeliveryStatus.Date);
    }
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
export interface PreviousRequests {
    DraftID: number;
    ServiceEnterSheetID: string;
    PurchaseOrder: string;
    Amount: string;
}
const ELEMENT_DATA1: PreviousRequests[] = [{ DraftID: 102654, PurchaseOrder: '8001002118', ServiceEnterSheetID: '10', Amount: '25411.00' }];
