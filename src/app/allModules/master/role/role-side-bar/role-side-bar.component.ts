import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { RoleWithApp } from 'app/models/master';

@Component({
  selector: 'role-side-bar',
  templateUrl: './role-side-bar.component.html',
  styleUrls: ['./role-side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RoleSideBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: Guid;
  @Input() AllRoles: RoleWithApp[] = [];
  @Output() RoleSelectionChanged: EventEmitter<RoleWithApp> = new EventEmitter<RoleWithApp>();
  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(public snackBar: MatSnackBar) {
    this.searchText = '';
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    if (this.AllRoles.length > 0) {
      this.selectID = this.AllRoles[0].RoleID;
      this.loadSelectedRole(this.AllRoles[0]);
    }
  }

  loadSelectedRole(SelectedRole: RoleWithApp): void {
    this.selectID = SelectedRole.RoleID;
    this.RoleSelectionChanged.emit(SelectedRole);
    // console.log(SelectedMenuApp);
  }

  clearRole(): void {
    this.selectID = null;
    this.RoleSelectionChanged.emit(null);
  }

}

