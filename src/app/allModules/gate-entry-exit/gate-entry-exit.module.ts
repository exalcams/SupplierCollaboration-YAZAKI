import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    MatDatepickerModule
} from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseSharedModule } from '@fuse/shared.module';

import { GateEntryComponent } from './gate-entry/gate-entry.component';

const gateEntry_Exit_Route: Routes = [
    {
        path: 'gateentry',
        component: GateEntryComponent
    }
];

@NgModule({
    declarations: [GateEntryComponent],
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
        MatDatepickerModule,
        MatDialogModule,
        MatChipsModule,
        MatTooltipModule,
        RouterModule.forChild(gateEntry_Exit_Route)
    ]
})
export class GateEntryExitModule {}
