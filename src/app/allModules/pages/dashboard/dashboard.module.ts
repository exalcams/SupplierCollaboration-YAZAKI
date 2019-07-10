import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule,
    MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCardModule, MatTooltipModule, MatExpansionModule, MatIconModule, MatDividerModule, MatChipsModule, MatPaginatorModule, MatRippleModule, MatTabsModule, MatSnackBarModule, MatSelectModule, MatListModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { DashboardComponent } from './dashboard.component';
import { ArchwizardModule } from 'angular-archwizard';
import { SharedModule } from 'app/shared/shared-module';
import { FuseWidgetModule, FuseSidebarModule, FuseDemoModule } from '@fuse/components';

const authRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },

];

@NgModule({
    declarations: [
        DashboardComponent,
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

        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        FuseWidgetModule
    ],
})
export class DashboardModule {
}
