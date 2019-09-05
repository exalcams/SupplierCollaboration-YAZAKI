import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CAPAConfirmationStatusView } from 'app/models/document-collection.model';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-capa-confirmation-dialog',
  templateUrl: './capa-confirmation-dialog.component.html',
  styleUrls: ['./capa-confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CapaConfirmationDialogComponent implements OnInit {
  CAPAConfirmationFormGroup: FormGroup;
  BGClassName: any;
  compStyles: CSSStyleDeclaration;
  constructor(
    public matDialogRef: MatDialogRef<CapaConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public CAPAStatusViewDATA: CAPAConfirmationStatusView,
    private formBuilder: FormBuilder,
    private _fuseConfigService: FuseConfigService,
  ) { }

  ngOnInit(): void {
    this.CAPAConfirmationFormGroup = this.formBuilder.group({
      Reason: ['', Validators.required],
    });
    this._fuseConfigService.config.subscribe((config) => {
      this.BGClassName = config;
      const backgroundElement = document.querySelector(`.${this.BGClassName.layout.toolbar.background}`);
      this.compStyles = window.getComputedStyle(backgroundElement);
    });
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
