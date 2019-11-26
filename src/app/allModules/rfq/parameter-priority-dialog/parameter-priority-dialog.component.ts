import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { RFQService } from 'app/services/rfq.service';
import { fuseAnimations } from '@fuse/animations';
import { PriorityParameter, RFQParameterPriority } from 'app/models/rfq.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parameter-priority-dialog',
  templateUrl: './parameter-priority-dialog.component.html',
  styleUrls: ['./parameter-priority-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ParameterPriorityDialogComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  CurrentUserName: string;
  CurrentUserID: Guid;
  AllPriorityParameters: PriorityParameter[];
  CurrentRFQParameterPriority: RFQParameterPriority[] = [];
  constructor(
    public matDialogRef: MatDialogRef<ParameterPriorityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _rfqService: RFQService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetAllPriorityParameters();
  }

  GetAllPriorityParameters(): void {
    this._rfqService.GetAllPriorityParameters().subscribe(
      (data) => {
        this.AllPriorityParameters = data as PriorityParameter[];
      },
      (err) => {
        console.error(err);
      }
    );
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.AllPriorityParameters, event.previousIndex, event.currentIndex);
  }
  YesClicked(): void {
    const len = this.AllPriorityParameters.length;
    this.AllPriorityParameters.forEach((pp, i) => {
      const t: RFQParameterPriority = new RFQParameterPriority();
      t.Parameter = pp.Parameter;
      t.Priority = i + 1;
      t.PriorityValue = len - i;
      t.CreatedBy = this.CurrentUserID.toString();
      this.CurrentRFQParameterPriority.push(t);
    });
    this.matDialogRef.close(this.CurrentRFQParameterPriority);
  }
  CloseClicked(): void {
    this.matDialogRef.close(null);
  }

  RemovePriority(pp: PriorityParameter): void {
    const index = this.AllPriorityParameters.indexOf(pp);
    if (index >= 0) {
      this.AllPriorityParameters.splice(index, 1);
    }
  }

}
