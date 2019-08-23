import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    MatFormFieldModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    // MatTreeModule,
    // MatAutocompleteModule,
    // MatBadgeModule,
    // MatBottomSheetModule,
    // MatChipsModule,
    // MatListModule,
    // MatMenuModule,
    // MatNativeDateModule,
    // MatProgressBarModule,
    // MatRippleModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatStepperModule,
    // MatTabsModule,

} from '@angular/material';

// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import {
//     FuseCountdownModule,
//     FuseHighlightModule,
//     FuseMaterialColorPickerModule,
//     FuseWidgetModule
// } from '@fuse/components';
import { FormsModule } from '@angular/forms';
import { FuseSharedModule } from '@fuse/shared.module';

// const routes: Routes = [
//     {
//         path: 'creation',
//         component: PRScreenVendorComponent,
//     },
//     {
//         path: 'publish',
//         component: RFQScreenComponent
//     },
//     {
//         path: 'evaluation',
//         component: SupplierInviteScreenComponent
//     },
//     {
//         path: 'awarded',
//         component: VendorComparisonComponent
//     },
//     {
//         path: '**',
//         redirectTo: '/auth/login'
//     }
// ];

@NgModule({
    imports: [
        // RouterModule.forChild(routes),
        MatFormFieldModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        // MatTreeModule,
        // MatAutocompleteModule,
        // MatBadgeModule,
        // MatBottomSheetModule,
        // MatChipsModule,
        // MatStepperModule,
        // MatListModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatProgressBarModule,
        // MatRippleModule,
        // MatSliderModule,
        // MatSlideToggleModule,
        // MatTabsModule,

        // NgxChartsModule,

        // FuseCountdownModule,
        // FuseHighlightModule,
        // FuseMaterialColorPickerModule,
        // FuseWidgetModule,

        FuseSharedModule,
        FormsModule,
    ],
    declarations: [],
    providers: [],
    entryComponents: [
    ]
})
export class PagesModule { }
