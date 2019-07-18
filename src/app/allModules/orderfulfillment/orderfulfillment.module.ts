import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentnotificationComponent } from './shipmentnotification/shipmentnotification.component';
import { Routes, RouterModule } from '@angular/router';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDialogModule,
    MatTableModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSortModule,
    MatDatepickerModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MatTooltipModule } from '@angular/material/tooltip';

const shipmentNotification: Routes = [
    {
        path: 'shipment',
        component: ShipmentnotificationComponent
    }
];

@NgModule({
    declarations: [ShipmentnotificationComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatMenuModule,
        MatRadioModule,
        MatSidenavModule,
        MatToolbarModule,
        FuseSharedModule,
        FileUploadModule,
        MatTableModule,
        MatSortModule,
        MatDatepickerModule,
        MatDialogModule,
        MatChipsModule,
        MatTooltipModule,
        RouterModule.forChild(shipmentNotification)
    ]
})
export class OrderfulfillmentModule {}
