import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { UserWithRole } from 'app/models/master';

@Component({
  selector: 'user-side-bar',
  templateUrl: './user-side-bar.component.html',
  styleUrls: ['./user-side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserSideBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: Guid;
  @Input() AllUsers: UserWithRole[] = [];
  @Output() UserSelectionChanged: EventEmitter<UserWithRole> = new EventEmitter<UserWithRole>();
  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(public snackBar: MatSnackBar) {
    this.searchText = '';
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    if (this.AllUsers.length > 0) {
      this.selectID = this.AllUsers[0].UserID;
      this.loadSelectedUser(this.AllUsers[0]);
    }
  }

  loadSelectedUser(SelectedUser: UserWithRole): void {
    this.selectID = SelectedUser.UserID;
    this.UserSelectionChanged.emit(SelectedUser);
    // console.log(SelectedMenuApp);
  }

  clearUser(): void {
    this.selectID = null;
    this.UserSelectionChanged.emit(null);
  }

}
