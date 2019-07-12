import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
} from '@angular/material';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
    FuseCountdownModule,
    FuseHighlightModule,
    FuseMaterialColorPickerModule,
    FuseWidgetModule
} from '@fuse/components';
import { FormsModule } from '@angular/forms';
import { PRScreenVendorComponent } from './prscreen-vendor/prscreen-vendor.component';
import { RFQScreenComponent } from './rfqscreen/rfqscreen.component';
import { VendorComparisonComponent } from './vendor-comparison/vendor-comparison.component';
import { SupplierInviteScreenComponent } from './supplier-invite-screen/supplier-invite-screen.component';
import { FuseSharedModule } from '@fuse/shared.module';

const routes: Routes = [
    {
        path: 'creation',
        component: PRScreenVendorComponent,
    },
    {
        path: 'publish',
        component: RFQScreenComponent
    },
    {
        path: 'evaluation',
        component: SupplierInviteScreenComponent
    },
    {
        path: 'awarded',
        component: VendorComparisonComponent
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // HttpClientModule,
        // TranslateModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,

        NgxChartsModule,

        FuseSharedModule,

        FuseCountdownModule,
        FuseHighlightModule,
        FuseMaterialColorPickerModule,
        FuseWidgetModule,

        FormsModule,
    ],
    declarations: [PRScreenVendorComponent, RFQScreenComponent, VendorComparisonComponent, SupplierInviteScreenComponent],
    providers: [],
    entryComponents: [
    ]
})
export class PagesModule { }
