import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-terms-and-conditions-dialog',
  templateUrl: './terms-and-conditions-dialog.component.html',
  styleUrls: ['./terms-and-conditions-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TermsAndConditionsDialogComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<TermsAndConditionsDialogComponent>,
  ) {
  }

  ngOnInit(): void {

  }
  YesClicked(): void {
    this.matDialogRef.close(null);
  }

  CloseClicked(): void {
    this.matDialogRef.close(null);
  }

}
