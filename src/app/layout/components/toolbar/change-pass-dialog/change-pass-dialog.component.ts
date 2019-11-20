import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangePassword } from 'app/models/master';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { CustomValidator } from 'app/shared/custom-validator';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-change-pass-dialog',
  templateUrl: './change-pass-dialog.component.html',
  styleUrls: ['./change-pass-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ChangePassDialogComponent implements OnInit {
  resetPasswordForm: FormGroup;
  changePassword: ChangePassword;
  notificationSnackBarComponent: NotificationSnackBarComponent;

  constructor(
    public matDialogRef: MatDialogRef<ChangePassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar

  ) {
    this.resetPasswordForm = this._formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required,
      Validators.pattern('(?=.*[a-z].*[a-z].*[a-z])(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: ['', [Validators.required, CustomValidator.confirmPasswordValidator]]
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
  }

  YesClicked(): void {
    if (this.resetPasswordForm.valid) {
      this.changePassword = new ChangePassword();
      this.changePassword.CurrentPassword = this.resetPasswordForm.get('currentPassword').value;
      this.changePassword.NewPassword = this.resetPasswordForm.get('newPassword').value;
      const confirmPassword = this.resetPasswordForm.get('confirmPassword').value;
      if (this.changePassword.CurrentPassword === this.changePassword.NewPassword) {
        this.notificationSnackBarComponent.openSnackBar('New password should be different from old password', SnackBarStatus.danger);
      }
      else if (this.changePassword.NewPassword !== confirmPassword) {
        this.notificationSnackBarComponent.openSnackBar('Confirm password should be same as new password', SnackBarStatus.danger);
      }
      else {
        this.matDialogRef.close(this.changePassword);
      }
    } else {
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        this.resetPasswordForm.get(key).markAsTouched();
        this.resetPasswordForm.get(key).markAsDirty();
      });

    }
  }

  CloseClicked(): void {
    // console.log('Called');
    this.matDialogRef.close(null);
  }

}
