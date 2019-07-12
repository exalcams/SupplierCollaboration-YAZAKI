import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule,
    MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCardModule, MatTooltipModule, MatExpansionModule, MatIconModule, MatDividerModule, MatChipsModule, MatPaginatorModule, MatRippleModule, MatTabsModule, MatSnackBarModule, MatSelectModule, MatListModule, MatDatepickerModule, MatStepperModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { DashboardComponent } from './dashboard.component';
import { ArchwizardModule } from 'angular-archwizard';
import { SharedModule } from 'app/shared/shared-module';
import { FuseWidgetModule, FuseSidebarModule, FuseDemoModule } from '@fuse/components';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { PurchaseOrderDetailsComponent } from './purchase-order-details/purchase-order-details.component';

const authRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'purchaseOrderDetails',
        component: PurchaseOrderDetailsComponent
    }

];

@NgModule({
    declarations: [
        DashboardComponent,
        PurchaseOrderDetailsComponent,
    ],
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatCardModule,
        MatTooltipModule,
        MatInputModule,
        FuseSharedModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(authRoutes),
        MatSortModule,
        MatExpansionModule,
        MatIconModule,
        MatTableModule,
        MatDividerModule,
        MatListModule,
        ArchwizardModule,
        SharedModule,

        RouterModule,
        MatChipsModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTabsModule,
        NgxChartsModule,
        ChartsModule,

        FuseSidebarModule,
        FuseDemoModule,

        CommonModule,
        MatStepperModule,
        MatMenuModule,
        MatRadioModule,
        MatSidenavModule,
        MatToolbarModule,
        FileUploadModule,
        MatDatepickerModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        FuseWidgetModule
    ],
})
export class DashboardModule {
}
