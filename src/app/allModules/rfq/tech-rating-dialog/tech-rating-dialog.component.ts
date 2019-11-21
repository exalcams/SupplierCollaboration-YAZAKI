import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RFQResponseTechRating } from 'app/models/rfq.model';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ChangePassword } from 'app/models/master';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { StarRatingComponent } from 'ng-starrating';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-tech-rating-dialog',
  templateUrl: './tech-rating-dialog.component.html',
  styleUrls: ['./tech-rating-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TechRatingDialogComponent implements OnInit {
  techRatingForm: FormGroup;
  rfqResponseTechRating: RFQResponseTechRating;
  notificationSnackBarComponent: NotificationSnackBarComponent;

  constructor(
    public matDialogRef: MatDialogRef<TechRatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar

  ) {
    this.techRatingForm = this._formBuilder.group({
      Comment: ['', Validators.required],
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    this.rfqResponseTechRating = this.data as RFQResponseTechRating;
    if (this.rfqResponseTechRating && this.rfqResponseTechRating.Comment) {
      this.techRatingForm.get('Comment').patchValue(this.rfqResponseTechRating.Comment);
    }
  }

  onRate($event: { oldValue: number, newValue: number, starRating: StarRatingComponent }): void {
    console.log($event.newValue);
    this.rfqResponseTechRating.TechRating = $event.newValue;
  }

  YesClicked(): void {
    if (this.rfqResponseTechRating.TechRating > 0) {
      if (this.techRatingForm.valid) {
        this.rfqResponseTechRating.Comment = this.techRatingForm.get('Comment').value;
        this.matDialogRef.close(this.rfqResponseTechRating);

      } else {
        Object.keys(this.techRatingForm.controls).forEach(key => {
          this.techRatingForm.get(key).markAsTouched();
          this.techRatingForm.get(key).markAsDirty();
        });
      }

    } else {
      this.notificationSnackBarComponent.openSnackBar('please provide the rating', SnackBarStatus.warning);
    }
  }

  CloseClicked(): void {
    // console.log('Called');
    this.matDialogRef.close(null);
  }

}
