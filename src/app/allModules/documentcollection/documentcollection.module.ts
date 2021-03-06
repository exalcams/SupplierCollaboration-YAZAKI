import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { VendorAssignmentComponent } from './vendor-assignment/vendor-assignment.component';
import { CapaAssignmentComponent } from './capa-assignment/capa-assignment.component';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import { CapaResponseComponent } from './capa-response/capa-response.component';
import { CapaConfirmationDialogComponent } from './capa-confirmation-dialog/capa-confirmation-dialog.component';

const documentCollection: Routes = [
  {
    path: 'vendor_assignment',
    component: VendorAssignmentComponent
  },
  {
    path: 'capa_assignment',
    component: CapaAssignmentComponent
  },
  {
    path: 'capaResponse',
    component: CapaResponseComponent
  }
];

@NgModule({
  declarations: [VendorAssignmentComponent, CapaAssignmentComponent, CapaResponseComponent, CapaConfirmationDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(documentCollection),
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
  entryComponents: [
    CapaConfirmationDialogComponent
  ]
})
export class DocumentcollectionModule { }
