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
import { FuseSharedModule } from '@fuse/shared.module';
import { CreationComponent } from './creation/creation.component';
import { PublishComponent } from './publish/publish.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { AwardedComponent } from './awarded/awarded.component';
import { PurchaseRequisitionVendorComponent } from './purchase-requisition-vendor/purchase-requisition-vendor.component';
import { ResponseComponent } from './response/response.component';
import { PurchaseRequisitionComponent } from './purchase-requisition/purchase-requisition.component';
import { RFQVendorComponent } from './rfq-vendor/rfq-vendor.component';
import { AwardedDetailsComponent } from './awarded-details/awarded-details.component';
import { SharedModule } from 'app/shared/shared-module';
import { ParameterPriorityDialogComponent } from './parameter-priority-dialog/parameter-priority-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RatingModule } from 'ng-starrating';
// import { StarRatingModule } from 'angular-star-rating';
import { TechRatingDialogComponent } from './tech-rating-dialog/tech-rating-dialog.component';
import { TechRatingReviewDialogComponent } from './tech-rating-review-dialog/tech-rating-review-dialog.component';
import { TermsAndConditionsDialogComponent } from './terms-and-conditions-dialog/terms-and-conditions-dialog.component';
const routes: Routes = [
    {
        path: 'pr',
        component: PurchaseRequisitionComponent
    },
    {
        path: 'creation',
        component: CreationComponent,
    },
    {
        path: 'publish',
        component: PublishComponent
    },
    {
        path: 'evaluation',
        component: EvaluationComponent
    },
    {
        path: 'rfqvendor',
        component: RFQVendorComponent
    },
    // {
    //     path: 'prvendor',
    //     component: PurchaseRequisitionVendorComponent
    // },
    {
        path: 'response',
        component: ResponseComponent
    },
    {
        path: 'awarded',
        component: AwardedComponent
    },
    {
        path: 'awardedDetails',
        component: AwardedDetailsComponent
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
        MatBadgeModule,

        NgxChartsModule,

        FuseSharedModule,

        FuseCountdownModule,
        FuseHighlightModule,
        FuseMaterialColorPickerModule,
        FuseWidgetModule,

        FormsModule,
        SharedModule,
        DragDropModule,
        RatingModule,
        // StarRatingModule.forRoot()
    ],
    declarations: [
        PurchaseRequisitionComponent,
        CreationComponent,
        PublishComponent,
        EvaluationComponent,
        AwardedComponent,
        AwardedDetailsComponent,
        PurchaseRequisitionVendorComponent,
        RFQVendorComponent,
        ResponseComponent,
        ParameterPriorityDialogComponent,
        TechRatingDialogComponent,
        TechRatingReviewDialogComponent,
        TermsAndConditionsDialogComponent
    ],
    providers: [],
    entryComponents: [
        ParameterPriorityDialogComponent,
        TechRatingDialogComponent,
        TechRatingReviewDialogComponent,
        TermsAndConditionsDialogComponent
    ]
})
export class RFQModule { }
