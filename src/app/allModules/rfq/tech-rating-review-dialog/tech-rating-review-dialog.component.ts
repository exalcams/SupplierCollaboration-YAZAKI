import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { RFQResponseTechRating, RFQResponseTechRatingView } from 'app/models/rfq.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-tech-rating-review-dialog',
  templateUrl: './tech-rating-review-dialog.component.html',
  styleUrls: ['./tech-rating-review-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TechRatingReviewDialogComponent implements OnInit {
  rfqResponseTechRatings: RFQResponseTechRatingView[];

  constructor(
    public matDialogRef: MatDialogRef<TechRatingReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.rfqResponseTechRatings = this.data as RFQResponseTechRatingView[];
  }
  YesClicked(): void {
    this.matDialogRef.close(null);
  }

  CloseClicked(): void {
    // console.log('Called');
    this.matDialogRef.close(null);
  }

}
