import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule, MatSnackBar, MatSnackBarModule, MatDialogModule, MatToolbarModule, MAT_DATE_LOCALE } from '@angular/material';
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
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { WINDOW_PROVIDERS } from './window.providers';
import { AttachmentsDialogComponent } from './shared/attachments-dialog/attachments-dialog.component';
import { StarRatingModule } from 'angular-star-rating';
// import { SupportTicketModule } from './allModules/support-ticket/support-ticket.module';
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
        path: 'documentCollection',
        loadChildren: './allModules/documentcollection/documentcollection.module#DocumentcollectionModule'
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
        path: 'supportTicket',
        loadChildren: './allModules/support-ticket/support-ticket.module#SupportTicketModule'
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];

@NgModule({
    declarations: [
        AppComponent, 
        NotificationSnackBarComponent, 
        NotificationDialogComponent, 
        AttachmentsDialogComponent,
    ],
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
        // StarRatingModule.forRoot()
    ],
    providers: [
        DatePipe,
        WINDOW_PROVIDERS,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    ],
    bootstrap: [AppComponent],
    entryComponents: [NotificationDialogComponent, AttachmentsDialogComponent]
})
export class AppModule { }
