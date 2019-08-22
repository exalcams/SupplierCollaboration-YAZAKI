import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { ForgetPasswordLinkDialogComponent } from './forget-password-link-dialog/forget-password-link-dialog.component';

const authRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'forgotPassword',
        component: ForgotPasswordComponent
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
@NgModule({
        declarations: [
            LoginComponent,
            ForgotPasswordComponent,
            ChangePasswordDialogComponent,
            ForgetPasswordLinkDialogComponent,
        ],
        imports: [
            MatButtonModule,
            MatCheckboxModule,
            MatFormFieldModule,
            MatInputModule,
            MatIconModule,
            FuseSharedModule,
            MatDialogModule,
            MatProgressSpinnerModule,
            MatToolbarModule,
            RouterModule.forChild(authRoutes)
        ],
        entryComponents: [
            ChangePasswordDialogComponent,
            ForgetPasswordLinkDialogComponent
        ]
    })
export class AuthenticationModule {
}
