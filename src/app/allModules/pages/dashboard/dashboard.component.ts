import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/master';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  public isVisible: boolean;
  // private LinItemList: LineItems[];
  public OrderList: Orders[];
  displayedColumns: string[] = ['Description', 'Quantity', 'Rate'];
  displayedColumns1: string[] = ['Description', 'Quantity', 'Status'];
  widget5: any = {};
  selected = 'Month';
  constructor(private _router: Router, matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer, public snackBar: MatSnackBar) {
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
            pointRadius:1,
            // pointHoverRadius: 7,
            // pointBorderWidth: 5,
            // pointBorderColor: '#ffffff',
            pointBackgroundColor: "#2979ff",
            // borderWidth: 1
          },
          {
            type: 'line',
            label: '',
            data: [20, 70, 27,38 , 22, 65, 22, 19],
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
    // this.LinItemList = [
    //   { ItemID: 1, Description: 'Carrier 1.5 Ton 3 star (2018) Split AC (Copper,White)', Quantity: 1, Rate: 24, Status: 'In Production' },
    //   { ItemID: 2, Description: 'VGaurd VG 400 AE 10 Stabilizer (White)', Quantity: 1, Rate: 24, Status: 'Ready to be packed' }
    // ]
  }

  //   widget5: {
  //     chartType: 'line',
  //     datasets : {
  //                 data : [190, 300, 340, 220, 290, 390, 250, 380, 410, 380, 320, 290],
  //                 fill : 'start'
  //             // {
  //             //     data : [2200, 2900, 3900, 2500, 3800, 3200, 2900, 1900, 3000, 3400, 4100, 3800],
  //             //     fill : 'start'
  //             // }

  //     },
  //     labels   : ['12am', '2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'],
  //     colors   : [
  //         {
  //             borderColor              : '#3949ab',
  //             backgroundColor          : '#3949ab',
  //             pointBackgroundColor     : '#3949ab',
  //             pointHoverBackgroundColor: '#3949ab',
  //             pointBorderColor         : '#ffffff',
  //             pointHoverBorderColor    : '#ffffff'
  //         },
  //         {
  //             borderColor              : 'rgba(30, 136, 229, 0.87)',
  //             backgroundColor          : 'rgba(30, 136, 229, 0.87)',
  //             pointBackgroundColor     : 'rgba(30, 136, 229, 0.87)',
  //             pointHoverBackgroundColor: 'rgba(30, 136, 229, 0.87)',
  //             pointBorderColor         : '#ffffff',
  //             pointHoverBorderColor    : '#ffffff'
  //         }
  //     ],
  //     options  : {
  //         spanGaps           : false,
  //         legend             : {
  //             display: false
  //         },
  //         maintainAspectRatio: false,
  //         tooltips           : {
  //             position : 'nearest',
  //             mode     : 'index',
  //             intersect: false
  //         },
  //         layout             : {
  //             padding: {
  //                 left : 24,
  //                 right: 32
  //             }
  //         },
  //         elements           : {
  //             point: {
  //                 radius          : 4,
  //                 borderWidth     : 2,
  //                 hoverRadius     : 4,
  //                 hoverBorderWidth: 2
  //             }
  //         },
  //         scales             : {
  //             xAxes: [
  //                 {
  //                     gridLines: {
  //                         display: false
  //                     },
  //                     ticks    : {
  //                         fontColor: 'rgba(0,0,0,0.54)'
  //                     }
  //                 }
  //             ],
  //             yAxes: [
  //                 {
  //                     gridLines: {
  //                         tickMarkLength: 16
  //                     },
  //                     ticks    : {
  //                         stepSize: 1000
  //                     }
  //                 }
  //             ]
  //         },
  //         plugins            : {
  //             filler: {
  //                 propagate: false
  //             }
  //         }
  //     }
  // }

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