import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from 'app/services/dashboard.service';
import { MasterService } from 'app/services/master.service';
import { CAPAConfirmationStatusView } from 'app/models/document-collection.model';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-capa-confirmation-dialog',
  templateUrl: './capa-confirmation-dialog.component.html',
  styleUrls: ['./capa-confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CapaConfirmationDialogComponent implements OnInit {
  CAPAConfirmationFormGroup: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<CapaConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public CAPAStatusViewDATA: CAPAConfirmationStatusView,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private masterService: MasterService
  ) { }

  ngOnInit(): void {
    this.CAPAConfirmationFormGroup = this.formBuilder.group({
      Reason: ['', Validators.required],
    });
    console.log(this.CAPAStatusViewDATA);
  }
  YesClicked(): void {
    if (this.CAPAConfirmationFormGroup.valid) {
      this.CAPAStatusViewDATA.Reason = this.CAPAConfirmationFormGroup.get('Reason').value;
      this.matDialogRef.close(this.CAPAStatusViewDATA);
    } else {
      Object.keys(this.CAPAConfirmationFormGroup.controls).forEach(key => {
        this.CAPAConfirmationFormGroup.get(key).markAsTouched();
        this.CAPAConfirmationFormGroup.get(key).markAsDirty();
      });

    }
  }
  CloseClicked(): void {
    this.matDialogRef.close(null);
  }

}
