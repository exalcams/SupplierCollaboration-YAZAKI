import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { EMailModel } from 'app/models/master';

@Component({
  selector: 'link-for-forget-password',
  templateUrl: './link-for-forget-password.component.html',
  styleUrls: ['./link-for-forget-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LinkForForgetPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  emailModel: EMailModel;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _platformLocation: PlatformLocation,
    private _router: Router,
    public snackBar: MatSnackBar

  ) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ResetControl(): void {
    this.forgotPasswordForm.get('email').patchValue('');
    this.emailModel = null;
    this.forgotPasswordForm.reset();
    this.forgotPasswordForm.markAsUntouched();
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      // control.setErrors(null);
      // this.menuAppMainFormGroup.get(key).markAsUntouched();
      // this.menuAppMainFormGroup.get(key).updateValueAndValidity();
      // console.log(this.menuAppMainFormGroup.get(key).setErrors(Validators.required)
    });

  }

  SendResetLink(): void {
    if (this.forgotPasswordForm.valid) {
      this.IsProgressBarVisibile = true;
      this.emailModel = new EMailModel();
      this.emailModel.EmailAddress = this.forgotPasswordForm.get('email').value;
      const Origin = (this._platformLocation as any).location.origin;
      this.emailModel.siteURL = `${Origin}/#/auth/forgotPassword`;

      this._authService.SendResetLinkToMail(this.emailModel).subscribe(
        (data) => {
          this.notificationSnackBarComponent.openSnackBar(`Reset password link sent successfully to ${this.emailModel.EmailAddress}`, SnackBarStatus.success);
          this.ResetControl();
          this.IsProgressBarVisibile = false;
          this._router.navigate(['auth/login']);
        },
        (err) => {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);          console.error(err);
        }
      );
      // console.log(this.emailModel.siteURL);


    }
    else {
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        this.forgotPasswordForm.get(key).markAsDirty();
      });
    }
  }

}
