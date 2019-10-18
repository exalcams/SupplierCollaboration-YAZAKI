import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';
import { SupportTicketConfirmationStatusView } from 'app/models/supportTicket.model';

@Component({
  selector: 'app-support-ticket-confirmation-dialog',
  templateUrl: './support-ticket-confirmation-dialog.component.html',
  styleUrls: ['./support-ticket-confirmation-dialog.component.scss']
})
export class SupportTicketConfirmationDialogComponent implements OnInit {
  SupportTicketConfirmationFormGroup: FormGroup;
  BGClassName: any;
  compStyles: CSSStyleDeclaration;
  constructor(
    public matDialogRef: MatDialogRef<SupportTicketConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public SupportTicketStatusViewDATA: SupportTicketConfirmationStatusView,
    private formBuilder: FormBuilder,
    private _fuseConfigService: FuseConfigService,
  ) { }

  ngOnInit(): void {
    this.SupportTicketConfirmationFormGroup = this.formBuilder.group({
      Reason: ['', Validators.required],
    });
    this._fuseConfigService.config.subscribe((config) => {
      this.BGClassName = config;
      const backgroundElement = document.querySelector(`.${this.BGClassName.layout.toolbar.background}`);
      this.compStyles = window.getComputedStyle(backgroundElement);
    });
  }
  YesClicked(): void {
    if (this.SupportTicketConfirmationFormGroup.valid) {
      this.SupportTicketStatusViewDATA.Reason = this.SupportTicketConfirmationFormGroup.get('Reason').value;
      this.matDialogRef.close(this.SupportTicketStatusViewDATA);
    } else {
      Object.keys(this.SupportTicketConfirmationFormGroup.controls).forEach(key => {
        this.SupportTicketConfirmationFormGroup.get(key).markAsTouched();
        this.SupportTicketConfirmationFormGroup.get(key).markAsDirty();
      });

    }
  }
  CloseClicked(): void {
    this.matDialogRef.close(null);
  }

}

