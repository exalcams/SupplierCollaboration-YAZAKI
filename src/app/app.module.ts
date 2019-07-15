import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule, MatSnackBar, MatSnackBarModule, MatDialogModule, MatToolbarModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { NotificationSnackBarComponent } from './notifications/notification-snack-bar/notification-snack-bar.component';
import { DatePipe } from '@angular/common';
import { NotificationDialogComponent } from './notifications/notification-dialog/notification-dialog.component';
// import { GateEntryExitModule } from './allModules/gate-entry-exit/gate-entry-exit.module';

const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: './allModules/authentication/authentication.module#AuthenticationModule'
    },
    {
        path: 'rfq',
        loadChildren: './allModules/rfq/rfq.module#RFQModule'
    },
    {
        path: 'dashboard',
        loadChildren: './allModules/pages/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'gateTransaction',
        loadChildren: './allModules/gate-entry-exit/gate-entry-exit.module#GateEntryExitModule'
    },
    {
        path: 'master',
        loadChildren: './allModules/master/master.module#MasterModule'
    },
    {
        path: 'paymentReport',
        loadChildren: './allModules/payment-report/payment-report.module#PaymentReportModule'
    },
    {
        path: 'order',
        loadChildren: './allModules/orderfulfillment/orderfulfillment.module#OrderfulfillmentModule'
    },
    {
        path: 'orderacknowledgment',
        loadChildren: './allModules/orderacknowledgment/orderacknowledgment.module#OrderacknowledgmentModule'
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];

@NgModule({
    declarations: [AppComponent, NotificationSnackBarComponent, NotificationDialogComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, useHash: true }),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatDialogModule,
        MatToolbarModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        // GateEntryExitModule

        // App modules
        LayoutModule,
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent],
    entryComponents: [NotificationDialogComponent]
})
export class AppModule {}
