import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { MenuApp } from 'app/models/master';

@Component({
  selector: 'menu-app-side-bar',
  templateUrl: './menu-app-side-bar.component.html',
  styleUrls: ['./menu-app-side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MenuAppSideBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: number;
  @Input() AllMenuApps: MenuApp[] = [];
  @Output() MenuAppSelectionChanged: EventEmitter<MenuApp> = new EventEmitter<MenuApp>();
  notificationSnackBarComponent: NotificationSnackBarComponent;

  constructor(public snackBar: MatSnackBar) {
    this.searchText = '';
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    // if (this.AllMenuApps.length > 0) {
    //   this.selectID = this.AllMenuApps[0].AppID;
    // }
  }


  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    if (this.AllMenuApps.length > 0) {
      this.selectID = this.AllMenuApps[0].AppID;
      this.loadSelectedMenuApp(this.AllMenuApps[0]);
    }
  }

  loadSelectedMenuApp(SelectedMenuApp: MenuApp): void {
    this.selectID = SelectedMenuApp.AppID;
    this.MenuAppSelectionChanged.emit(SelectedMenuApp);
    // console.log(SelectedMenuApp);
  }

  clearMenuApp(): void {
    this.selectID = 0;
    this.MenuAppSelectionChanged.emit(null);
  }

}
