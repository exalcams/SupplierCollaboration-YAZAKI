import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from './dialog-data';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {
  // public dialogData: DialogData;
  BGClassName: any;
  compStyles: CSSStyleDeclaration;
  constructor(
    private _fuseConfigService: FuseConfigService,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
  ) {

  }

  ngOnInit(): void {
    this._fuseConfigService.config.subscribe((config) => {
      this.BGClassName = config;
      const backgroundElement = document.querySelector(`.${this.BGClassName.layout.toolbar.background}`);
      this.compStyles = window.getComputedStyle(backgroundElement);
    });
  }
  YesClicked(): void {
    this.dialogRef.close(true);
  }

  CloseClicked(): void {
    this.dialogRef.close(false);
  }

}
